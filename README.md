## アプリを起動
```
$ ruby app.rb
```
* アプリを実行すると：
  * テーブルが作成する (`db/schema.rb` の `up` メソッド)
  * json ファイルの中身をテーブルにマイグレイトする (`db/database_booter.rb` の `migrate` メソッド)
    * json は `db/jsons/` の配下にあるものが対象
  * sinatra のサーバーが起動して、リクエストを待ちける

## テーブル作成、マイグレイトの詳細
### テーブルを作成する
```
$ ruby db/schema.rb up
```
* `schema.rb` に定義されているテーブルを作成する
* データベース自体は事前に作成されている必要がある

### テーブルを削除する
```
$ ruby db/schema.rb down
```
* `up` で作成したテーブルを削除する

### テーブルを作成し、レコードをマイグレイトする
```
$ ruby db/database_booter.rb
```
* `db/schema.rb up` が実行され、`schema.rb` に定義されているテーブルが作成される
* `db/jsons/gen*-jp.json` の json ファイルすべてから、各種テーブルに `migrate` する
* 最終的に、下記のようなリレーションが作成される

<img src="https://raw.githubusercontent.com/Junya-Takaesu/zukan/main/ER.png?raw=true" alt="ER diagram" width="450px">

## 各ファイルのローディング
* `zeitwerk` gem を使ってローディングする
* `zeitwerk` を使ってローディングをする処理は `models/application_record.rb` に書いている
* `app.rb` で `require_relative "models/application_record.rb"` しているので、`ruby app.rb` で sinatra を起動したときに、必要なファイルがロードされる