#!/usr/bin/env bash

# 传哪吒三个参数
NEZHA_SERVER=${NEZHA_SERVER:-''}
NEZHA_PORT=${NEZHA_PORT:-''}
NEZHA_KEY=${NEZHA_KEY:-''}

# 三个变量不全则不安装哪吒客户端
check_variable() {
  [[ -z "${NEZHA_SERVER}" || -z "${NEZHA_PORT}" || -z "${NEZHA_KEY}" ]] && exit 0
}

# 安装系统依赖
check_dependencies() {
  DEPS_CHECK=("wget" "unzip")
  DEPS_INSTALL=(" wget" " unzip")
  for ((i=0;i<${#DEPS_CHECK[@]};i++)); do [[ ! $(type -p ${DEPS_CHECK[i]}) ]] && DEPS+=${DEPS_INSTALL[i]}; done
  [ -n "$DEPS" ] && { apt-get update >/dev/null 2>&1; apt-get install -y $DEPS >/dev/null 2>&1; }
}

# 下载最新版本 Nezha Agent
download_agent() {
  if [ ! -f "nezha-agent" ]; then
    wget "https://github.com/hello20030909/file/raw/main/nezha-agent.zip"
    unzip nezha-agent.zip && rm -f nezha-agent.zip
    chmod 777 nezha-agent
  fi
}

# 运行客户端
run() {
  ./nezha-agent -s ${NEZHA_SERVER}:${NEZHA_PORT} -p ${NEZHA_KEY}
}

check_variable
check_dependencies
download_agent
run


