use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod todo_list {
    use super::*;

    /// 初始化待办事项计数器
    pub fn initialize_counter(ctx: Context<InitializeCounter>) -> Result<()> {
        let counter = &mut ctx.accounts.todo_counter;
        counter.owner = ctx.accounts.user.key();
        counter.count = 0;
        counter.bump = ctx.bumps.todo_counter;

        msg!("Counter initialized for user: {}", counter.owner);
        Ok(())
    }

    /// 创建新的待办事项
    pub fn create_todo(ctx: Context<CreateTodo>, text: String) -> Result<()> {
        require!(
            !text.is_empty() && text.len() <= 500,
            TodoError::InvalidText
        );

        let todo_counter = &mut ctx.accounts.todo_counter;
        let current_count = todo_counter.count;

        let todo = &mut ctx.accounts.todo;
        todo.owner = ctx.accounts.user.key();
        todo.text = text;
        todo.completed = false;
        todo.created_at = Clock::get()?.unix_timestamp;
        todo.todo_id = current_count;
        todo.bump = ctx.bumps.todo;

        // 递增计数器
        todo_counter.count = todo_counter.count
            .checked_add(1)
            .ok_or(TodoError::CounterOverflow)?;

        msg!("Todo created: {} (ID: {})", todo.text, todo.todo_id);
        Ok(())
    }

    /// 切换待办事项的完成状态
    pub fn toggle_todo(ctx: Context<ToggleTodo>) -> Result<()> {
        let todo = &mut ctx.accounts.todo;
        todo.completed = !todo.completed;

        msg!("Todo toggled: {} - completed: {}", todo.text, todo.completed);
        Ok(())
    }

    /// 更新待办事项文本
    pub fn update_todo(ctx: Context<UpdateTodo>, new_text: String) -> Result<()> {
        require!(
            !new_text.is_empty() && new_text.len() <= 500,
            TodoError::InvalidText
        );

        let todo = &mut ctx.accounts.todo;
        todo.text = new_text;

        msg!("Todo updated: {}", todo.text);
        Ok(())
    }

    /// 删除待办事项
    pub fn delete_todo(_ctx: Context<DeleteTodo>) -> Result<()> {
        msg!("Todo deleted");
        Ok(())
    }
}

/// 初始化计数器的上下文
#[derive(Accounts)]
pub struct InitializeCounter<'info> {
    #[account(
        init,
        payer = user,
        space = TodoCounter::SPACE,
        seeds = [b"counter", user.key().as_ref()],
        bump
    )]
    pub todo_counter: Account<'info, TodoCounter>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

/// 创建待办事项的上下文
#[derive(Accounts)]
#[instruction(text: String)]
pub struct CreateTodo<'info> {
    #[account(
        init,
        payer = user,
        space = Todo::SPACE,
        seeds = [b"todo", user.key().as_ref(), &todo_counter.count.to_le_bytes()],
        bump
    )]
    pub todo: Account<'info, Todo>,

    #[account(
        mut,
        seeds = [b"counter", user.key().as_ref()],
        bump = todo_counter.bump
    )]
    pub todo_counter: Account<'info, TodoCounter>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

/// 切换待办事项状态的上下文
#[derive(Accounts)]
pub struct ToggleTodo<'info> {
    #[account(
        mut,
        has_one = owner,
        seeds = [b"todo", owner.key().as_ref(), &todo.todo_id.to_le_bytes()],
        bump = todo.bump
    )]
    pub todo: Account<'info, Todo>,

    pub owner: Signer<'info>,
}

/// 更新待办事项的上下文
#[derive(Accounts)]
pub struct UpdateTodo<'info> {
    #[account(
        mut,
        has_one = owner,
        seeds = [b"todo", owner.key().as_ref(), &todo.todo_id.to_le_bytes()],
        bump = todo.bump
    )]
    pub todo: Account<'info, Todo>,

    pub owner: Signer<'info>,
}

/// 删除待办事项的上下文
#[derive(Accounts)]
pub struct DeleteTodo<'info> {
    #[account(
        mut,
        has_one = owner,
        close = owner,
        seeds = [b"todo", owner.key().as_ref(), &todo.todo_id.to_le_bytes()],
        bump = todo.bump
    )]
    pub todo: Account<'info, Todo>,

    #[account(mut)]
    pub owner: Signer<'info>,
}

/// 待办事项账户结构
#[account]
pub struct Todo {
    /// 所有者的公钥
    pub owner: Pubkey,          // 32 bytes
    /// 待办事项文本内容
    pub text: String,           // 4 + 500 bytes
    /// 是否完成
    pub completed: bool,        // 1 byte
    /// 创建时间戳
    pub created_at: i64,        // 8 bytes
    /// 待办事项 ID
    pub todo_id: u64,           // 8 bytes
    /// PDA bump
    pub bump: u8,               // 1 byte
}

impl Todo {
    pub const SPACE: usize = 8 + // discriminator
                            32 + // owner
                            4 + 500 + // text (String)
                            1 + // completed
                            8 + // created_at
                            8 + // todo_id
                            1; // bump
}

/// 待办事项计数器
#[account]
pub struct TodoCounter {
    /// 所有者的公钥
    pub owner: Pubkey,          // 32 bytes
    /// 待办事项总数
    pub count: u64,             // 8 bytes
    /// PDA bump
    pub bump: u8,               // 1 byte
}

impl TodoCounter {
    pub const SPACE: usize = 8 + // discriminator
                            32 + // owner
                            8 + // count
                            1; // bump
}

/// 错误类型定义
#[error_code]
pub enum TodoError {
    #[msg("文本不能为空或超过 500 个字符")]
    InvalidText,
    #[msg("待办事项计数器溢出")]
    CounterOverflow,
}
