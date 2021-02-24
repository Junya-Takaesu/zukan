## テーブルを作成する
```
$ ruby db/schema.rb up
```
* `schema.rb` に定義されているテーブルを作成する
* データベース自体は事前に作成されている必要がある

## テーブルを削除する
```
$ ruby db/schema.rb down
```
* `up` で作成したテーブルを削除する

## テーブルを作成し、レコードをマイグレイトする
```
$ ruby db/database_booter.rb
```
* `db/schema.rb up` が実行され、`schema.rb` に定義されているテーブルが作成される
* `db/jsons/gen*-jp.json` の json ファイルすべてから、各種テーブルに migrate する
* 最終的に、下記のようなリレーションが作成される

<img src="https://raw.githubusercontent.com/Junya-Takaesu/zukan/main/ER.png?raw=true" alt="ER diagram" width="450px">
