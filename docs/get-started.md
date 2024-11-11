---
sidebar_position: 2
---

# 开始使用

Limbo 包含客户端和服务端两个部分。

## 客户端

如果你想使用 Limbo 客户端，可以前往 GitHub Releases 页面下载对应平台的安装包。

[最新版本下载地址](https://github.com/sheason2019/limbo/releases/latest)

## 服务器

通常情况下，用户不需要自行部署服务器，因为 Limbo 服务器只保存用户的公开信息和经用户加密的密文信息，这意味着就连服务器本身也不知道用户到底在服务器里存储了什么内容，所以你可以放心的使用公开的 Limbo 服务器。

但对于那些知道自己在做什么，并仍然希望自行部署服务器的用户，请遵循以下步骤以使用 Docker Compose 快速完成服务的部署。

### 创建工作区

Limbo 采用 [Serverpod](https://serverpod.dev/) 作为同构服务器，部署 Limbo 服务器实际上就是在部署一个正常的 Serverpod 服务。

我们先在服务器上创建一个 `/home/usr/limbo` 文件夹作为工作区，然后在工作区里编写我们的部署配置。

### 编写密码配置

首先，我们在 `limbo` 文件夹下添加一个 `config` 目录，然后创建 `config/passwords.yaml` 文件，其中包含的内容如下所示：

```yml
shared:
  mySharedPassword: "<你的密钥>"
production:
  database: "<你的数据库用户密码>"
  redis: "<你的Redis密码>"
  serviceSecret: "<你的服务器密钥>"
```

它们的作用分别是：

- `shared.mySharedPassword` 用于分布式服务之间的互相通信。

- `production.database` 是用于连接 PostgreSQL 服务器的密码。

- `production.redis` 是用于连接 Redis 的密码。

- `production.serviceSecret` 是用于连接 `Serverpod Insight` 服务的密码。

一般来说我们会为每个密码项配置至少长度为 20 的密码，如果你不知道密码内容应当输入什么，可以使用 `openssl` 工具的随机数生成器随机生成密码：

```sh
openssl rand -hex 20
```

关于密码配置文件的更多信息可以参考官方文档 [Serverpod - Passwords file example](https://docs.serverpod.dev/concepts/configuration#passwords-file-example)。

### 编写服务配置

然后再创建一个 `config/production.yaml` 文件，内容如下：

```yml
apiServer:
  port: 8080
  publicHost: <你的站点地址>
  publicPort: 8080
  publicScheme: http
insightsServer:
  port: 8081
  publicHost: <你的站点地址>
  publicPort: 8081
  publicScheme: http
webServer:
  port: 8082
  publicHost: <你的站点地址>
  publicPort: 8082
  publicScheme: http
database:
  host: postgres
  port: 5432
  name: limbo
  user: postgres
  requireSsl: false
redis:
  enabled: false
  host: <你的站点地址>
  port: 6379
```

此文件内容是部署站点的描述文件，请用你的个人站点地址（域名或 IP）替换上面的`host`和`publicHost`，如果你试图修改配置从而将应用映射到别的端口或是连接到远程服务器，请参阅 [Serverpod 的官方文档](https://docs.serverpod.dev/concepts/configuration)。

### 编写 Compose 配置文件

在完成上面的工作后，我们就可以定义 Docker Compose 配置文件了。

在 `limbo` 目录下添加 `docker-compose.yaml` 文件，并写入以下内容：

```yaml
version: "3.7"

services:
  postgres:
    image: docker.io/postgres:16.3
    environment:
      POSTGRES_USER: postgres
      POSTGRES_DB: limbo
      POSTGRES_PASSWORD: <你的数据库用户密码>
    volumes:
      - limbo_data:/var/lib/postgresql/data
  serverpod:
    image: docker.io/sheason/limbo:latest
    environment:
      runmode: production
    ports:
      - "8080:8080"
      - "8081:8081"
      - "8082:8082"
    volumes:
      - "/home/usr/limbo/config:/config"
volumes:
  limbo_data:
```

注意，如果你的 `limbo` 工作区路径不是 `/home/usr/limbo`，请将 `services.serverpod.volumes` 中的路径映射替换为你自定义的路径。

然后，我们在 `limbo` 工作区执行 Docker Compose 命令以尝试拉起服务器。

```bash
docker compose up -d
```

如果一切正常，你的 Limbo 服务器应该已经开始正常运行。
