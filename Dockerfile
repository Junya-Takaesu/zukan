FROM ruby:3.0.1
RUN apt-get update -qq && apt-get install -y postgresql-client
WORKDIR /zukan
COPY Gemfile /zukan/Gemfile
COPY Gemfile.lock /zukan/Gemfile.lock
RUN gem install bundler
RUN bundle install
COPY . /zukan

EXPOSE 4567

CMD ["ruby", "app.rb"]