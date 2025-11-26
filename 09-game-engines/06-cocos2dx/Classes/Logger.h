#ifndef __LOGGER_H__
#define __LOGGER_H__

#include <string>
#include <map>
#include <sstream>
#include <ctime>
#include <iomanip>

class Logger {
public:
    enum Level {
        DEBUG,
        INFO,
        WARN,
        ERROR
    };

    static void setLevel(Level level);

    static void debug(const std::string& message, const std::map<std::string, std::string>& context = {});
    static void info(const std::string& message, const std::map<std::string, std::string>& context = {});
    static void warn(const std::string& message, const std::map<std::string, std::string>& context = {});
    static void error(const std::string& message, const std::map<std::string, std::string>& context = {});

private:
    static Level currentLevel;

    static void log(Level level, const std::string& message, const std::map<std::string, std::string>& context);
    static std::string levelToString(Level level);
    static std::string getCurrentTimestamp();
    static std::string contextToString(const std::map<std::string, std::string>& context);
};

#endif // __LOGGER_H__
