#include "Logger.h"
#include "cocos2d.h"
#include <iostream>

USING_NS_CC;

Logger::Level Logger::currentLevel = Logger::INFO;

void Logger::setLevel(Level level) {
    currentLevel = level;
}

void Logger::debug(const std::string& message, const std::map<std::string, std::string>& context) {
    log(DEBUG, message, context);
}

void Logger::info(const std::string& message, const std::map<std::string, std::string>& context) {
    log(INFO, message, context);
}

void Logger::warn(const std::string& message, const std::map<std::string, std::string>& context) {
    log(WARN, message, context);
}

void Logger::error(const std::string& message, const std::map<std::string, std::string>& context) {
    log(ERROR, message, context);
}

void Logger::log(Level level, const std::string& message, const std::map<std::string, std::string>& context) {
    if (level < currentLevel) {
        return;
    }

    std::ostringstream logStream;
    logStream << "[" << getCurrentTimestamp() << "] "
              << "[" << levelToString(level) << "] "
              << message;

    if (!context.empty()) {
        logStream << " | " << contextToString(context);
    }

    std::string logMessage = logStream.str();

    // Output to Cocos2d-x log
    if (level == ERROR) {
        CCLOGERROR("%s", logMessage.c_str());
    } else if (level == WARN) {
        CCLOGWARN("%s", logMessage.c_str());
    } else {
        CCLOG("%s", logMessage.c_str());
    }

    // Also output to console for debugging
    std::cout << logMessage << std::endl;
}

std::string Logger::levelToString(Level level) {
    switch (level) {
        case DEBUG: return "DEBUG";
        case INFO:  return "INFO";
        case WARN:  return "WARN";
        case ERROR: return "ERROR";
        default:    return "UNKNOWN";
    }
}

std::string Logger::getCurrentTimestamp() {
    auto now = std::time(nullptr);
    auto tm = *std::localtime(&now);
    std::ostringstream oss;
    oss << std::put_time(&tm, "%Y-%m-%d %H:%M:%S");
    return oss.str();
}

std::string Logger::contextToString(const std::map<std::string, std::string>& context) {
    std::ostringstream oss;
    bool first = true;
    for (const auto& pair : context) {
        if (!first) {
            oss << ", ";
        }
        oss << pair.first << "=" << pair.second;
        first = false;
    }
    return oss.str();
}
