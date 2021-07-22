# Organization Model のサンプル

今のところ node-db-migrate や PostgreSQL など、各種モジュールの動作確認用のプロジェクトです。一応、目指しているのは次の通りです。

- 汎用 SQL ビルダー (src/model/sql.ts)
- RDBMS 階層構造モデル (src/model/org.ts)

内部品質確認用に静的ソースコード解析、テストレポート、テストカバレッジ、TypeDoc の環境を構築し、 github actions で自動生成の上、 reports ブランチへ記録するようにしてます。

## 使い方

### 1. インストール

```sh
% yarn install
```

### 2. データベース (PostgreSQL) の起動

```sh
% docker compose up -d
```

### 3. データベースのマイグレーション

```sh
% yarn dbup
```

### 4. .env ファイルの作成

```sh
# .env
DB_PORT=15432
DB_USER=test
DB_PASSWORD=password
DB_SPACE=testDb
```

### 5. テスト

```sh
% yarn test
```

### 6. レポート参照
% git worktree add ./reports reports # 初回のみ
% open reports/index.html

## その他

今のところ、コードを追いかければ、こんなサンプルが落ちてます。

- node-db-migrate で
  - 自動タイムスタンプを設定する方法
  - インデックスやユニーク制約の付け方
  - 用意されてない要素 (view) の作り方
- it.each の使い方
- github actions のサービスコンテナ (postgresql) の使い方
