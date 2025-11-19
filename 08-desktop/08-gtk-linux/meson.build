project('todolist-gtk', 'c',
  version: '1.0.0',
  license: 'MIT',
  default_options: [
    'warning_level=2',
    'c_std=c11',
  ],
)

# Project information
app_id = 'com.example.TodoListGTK'
gettext_package = 'todolist-gtk'

# Configuration data
conf_data = configuration_data()
conf_data.set_quoted('APP_ID', app_id)
conf_data.set_quoted('VERSION', meson.project_version())
conf_data.set_quoted('GETTEXT_PACKAGE', gettext_package)
conf_data.set_quoted('LOCALEDIR', get_option('prefix') / get_option('localedir'))

# Generate config header
configure_file(
  output: 'config.h',
  configuration: conf_data,
)

# Add config directory to include path
config_h_dir = include_directories('.')

# Dependencies
gtk_dep = dependency('gtk4', version: '>= 4.0')
json_glib_dep = dependency('json-glib-1.0', version: '>= 1.6')

# Source files
sources = [
  'src/main.c',
  'src/todo_item.c',
  'src/todo_model.c',
  'src/todo_row.c',
  'src/todo_window.c',
  'src/storage.c',
]

# Include directories
inc_dirs = include_directories('src')

# Executable
executable('todolist-gtk',
  sources,
  dependencies: [gtk_dep, json_glib_dep],
  include_directories: [inc_dirs, config_h_dir],
  install: true,
)

# Desktop file
desktop_file = app_id + '.desktop'
desktop_data = configuration_data()
desktop_data.set('APP_ID', app_id)

configure_file(
  input: 'data/todolist-gtk.desktop.in',
  output: desktop_file,
  configuration: desktop_data,
  install: true,
  install_dir: get_option('datadir') / 'applications',
)

# AppData file
appdata_file = app_id + '.appdata.xml'
appdata_data = configuration_data()
appdata_data.set('APP_ID', app_id)

configure_file(
  input: 'data/todolist-gtk.appdata.xml.in',
  output: appdata_file,
  configuration: appdata_data,
  install: true,
  install_dir: get_option('datadir') / 'metainfo',
)

# Icon
install_data('data/todolist-gtk.svg',
  install_dir: get_option('datadir') / 'icons/hicolor/scalable/apps',
  rename: app_id + '.svg',
)

# Resources
install_data('resources/style.css',
  install_dir: get_option('datadir') / 'todolist-gtk',
)

# Internationalization
subdir('po')

# Summary
summary({
  'Version': meson.project_version(),
  'GTK Version': gtk_dep.version(),
  'Prefix': get_option('prefix'),
  'Bindir': get_option('bindir'),
}, section: 'Build Information')
