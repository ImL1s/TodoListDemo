using UnityEngine;

namespace TodoList.Utils
{
    /// <summary>
    /// 音頻管理器
    /// 管理應用程式的音效播放
    /// </summary>
    public class AudioManager : MonoBehaviour
    {
        #region 單例

        private static AudioManager instance;

        public static AudioManager Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = FindObjectOfType<AudioManager>();

                    if (instance == null)
                    {
                        GameObject go = new GameObject("AudioManager");
                        instance = go.AddComponent<AudioManager>();
                        DontDestroyOnLoad(go);
                    }
                }
                return instance;
            }
        }

        #endregion

        #region 字段

        [Header("Audio Settings")]
        [SerializeField] private bool enableSounds = true;
        [SerializeField] [Range(0f, 1f)] private float masterVolume = 1f;
        [SerializeField] [Range(0f, 1f)] private float sfxVolume = 0.5f;

        [Header("Sound Effects")]
        [SerializeField] private AudioClip addSound;
        [SerializeField] private AudioClip deleteSound;
        [SerializeField] private AudioClip completeSound;
        [SerializeField] private AudioClip uncompleteSound;
        [SerializeField] private AudioClip clickSound;
        [SerializeField] private AudioClip errorSound;
        [SerializeField] private AudioClip successSound;

        private AudioSource audioSource;

        #endregion

        #region Unity 生命週期

        private void Awake()
        {
            if (instance != null && instance != this)
            {
                Destroy(gameObject);
                return;
            }

            instance = this;
            DontDestroyOnLoad(gameObject);

            InitializeAudioSource();
        }

        #endregion

        #region 初始化

        private void InitializeAudioSource()
        {
            audioSource = GetComponent<AudioSource>();
            if (audioSource == null)
            {
                audioSource = gameObject.AddComponent<AudioSource>();
            }

            audioSource.playOnAwake = false;
            audioSource.volume = masterVolume * sfxVolume;
        }

        #endregion

        #region 播放音效

        /// <summary>
        /// 播放音效
        /// </summary>
        private void PlaySound(AudioClip clip, float volumeScale = 1f)
        {
            if (!enableSounds || clip == null || audioSource == null)
            {
                return;
            }

            audioSource.PlayOneShot(clip, volumeScale * masterVolume * sfxVolume);
        }

        /// <summary>
        /// 播放添加音效
        /// </summary>
        public void PlayAddSound()
        {
            PlaySound(addSound);
            Debug.Log("Play add sound");
        }

        /// <summary>
        /// 播放刪除音效
        /// </summary>
        public void PlayDeleteSound()
        {
            PlaySound(deleteSound);
            Debug.Log("Play delete sound");
        }

        /// <summary>
        /// 播放完成音效
        /// </summary>
        public void PlayCompleteSound()
        {
            PlaySound(completeSound);
            Debug.Log("Play complete sound");
        }

        /// <summary>
        /// 播放取消完成音效
        /// </summary>
        public void PlayUncompleteSound()
        {
            PlaySound(uncompleteSound);
            Debug.Log("Play uncomplete sound");
        }

        /// <summary>
        /// 播放點擊音效
        /// </summary>
        public void PlayClickSound()
        {
            PlaySound(clickSound, 0.5f);
        }

        /// <summary>
        /// 播放錯誤音效
        /// </summary>
        public void PlayErrorSound()
        {
            PlaySound(errorSound);
            Debug.Log("Play error sound");
        }

        /// <summary>
        /// 播放成功音效
        /// </summary>
        public void PlaySuccessSound()
        {
            PlaySound(successSound);
            Debug.Log("Play success sound");
        }

        /// <summary>
        /// 播放自定義音效
        /// </summary>
        public void PlayCustomSound(AudioClip clip, float volumeScale = 1f)
        {
            PlaySound(clip, volumeScale);
        }

        #endregion

        #region 音量控制

        /// <summary>
        /// 設置主音量
        /// </summary>
        public void SetMasterVolume(float volume)
        {
            masterVolume = Mathf.Clamp01(volume);
            UpdateVolume();
        }

        /// <summary>
        /// 設置音效音量
        /// </summary>
        public void SetSFXVolume(float volume)
        {
            sfxVolume = Mathf.Clamp01(volume);
            UpdateVolume();
        }

        /// <summary>
        /// 更新音量
        /// </summary>
        private void UpdateVolume()
        {
            if (audioSource != null)
            {
                audioSource.volume = masterVolume * sfxVolume;
            }
        }

        /// <summary>
        /// 切換音效開關
        /// </summary>
        public void ToggleSounds()
        {
            enableSounds = !enableSounds;
            Debug.Log($"Sounds {(enableSounds ? "enabled" : "disabled")}");
        }

        /// <summary>
        /// 設置音效開關
        /// </summary>
        public void SetSoundsEnabled(bool enabled)
        {
            enableSounds = enabled;
        }

        #endregion

        #region 公共屬性

        public bool SoundsEnabled
        {
            get => enableSounds;
            set => enableSounds = value;
        }

        public float MasterVolume
        {
            get => masterVolume;
            set => SetMasterVolume(value);
        }

        public float SFXVolume
        {
            get => sfxVolume;
            set => SetSFXVolume(value);
        }

        #endregion
    }
}
