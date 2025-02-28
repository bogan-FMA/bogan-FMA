import Head from 'next/head'
import Link from 'next/link'
import { getSortedPostsData } from '../lib/posts'
import Date from '../components/date'

export default function Home({ allPostsData }) {
  return (
    <div className="container">
      <Head>
        <title>技术博客</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          欢迎来到我的技术博客
        </h1>

        <div className="posts">
          {allPostsData.map(({ id, date, title }) => (
            <article key={id}>
              <Link href={`/posts/${id}`}>
                <h2>{title}</h2>
              </Link>
              <div className="date">
                <Date dateString={date} />
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer>
        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
          Github
        </a>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
} 