import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_KEY
)

async function runWorker(){

const { data: tweets } = await supabase
.from('submitted_tweets')
.select('*')
.eq('status','tracking')

for(const tweet of tweets){

const tweetId = tweet.tweet_id

const res = await fetch(`https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}`)

const data = await res.json()

const likes = data.favorite_count
const retweets = data.retweet_count
const replies = data.reply_count

const score =
likes +
(retweets * 2) +
(replies * 1.5)

await supabase
.from('leaderboard')
.upsert({
campaign_id: tweet.campaign_id,
user_id: tweet.user_id,
tweet_id: tweet.tweet_id,
score: score
})

}

}

runWorker()
