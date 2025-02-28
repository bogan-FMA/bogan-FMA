import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { getSortedPostsData } from '../lib/posts'
import Date from '../components/date'

export default function Home({ allPostsData }) {
  return (
    <div className="container">
      <Head>
        <title>技术博客</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main-content">
        <h1 className="title">最新文章</h1>
        <div className="posts">
          {allPostsData.map(({ id, date, title, excerpt, coverImage }) => (
            <article key={id} className="post-card">
              {coverImage && (
                <Image
                  src={coverImage}
                  alt={title}
                  width={800}
                  height={400}
                  className="post-image"
                />
              )}
              <div className="post-content">
                <Link href={`/posts/${id}`}>
                  <h2 className="post-title">{title}</h2>
                </Link>
                <p className="post-excerpt">{excerpt}</p>
                <div className="post-meta">
                  <span className="post-date">
                    <Date dateString={date} />
                  </span>
                  <div className="post-stats">
                    <span className="stat">
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                      <span>1.2k</span>
                    </span>
                    <span className="stat">
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>
                      </svg>
                      <span>8</span>
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <aside className="sidebar">
        <h2>热门文章</h2>
        <div className="popular-posts">
          {allPostsData.slice(0, 3).map(({ id, title, coverImage }) => (
            <div key={id} className="popular-post">
              {coverImage && (
                <Image
                  src={coverImage}
                  alt={title}
                  width={80}
                  height={80}
                  className="popular-post-image"
                />
              )}
              <div className="popular-post-content">
                <Link href={`/posts/${id}`}>
                  <h3>{title}</h3>
                </Link>
                <div className="author">
                  <Image
                    src="/images/avatar.jpg"
                    alt="Author"
                    width={24}
                    height={24}
                    className="author-avatar"
                  />
                  <span className="author-name">作者名字</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
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