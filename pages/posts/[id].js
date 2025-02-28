import Head from 'next/head'
import Image from 'next/image'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Date from '../../components/date'

export default function Post({ postData }) {
  return (
    <div className="container">
      <Head>
        <title>{postData.title}</title>
      </Head>
      
      <article className="main-content">
        {postData.coverImage && (
          <Image
            src={postData.coverImage}
            alt={postData.title}
            width={800}
            height={400}
            className="post-image"
          />
        )}
        <h1 className="post-title">{postData.title}</h1>
        <div className="post-meta">
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
          <div className="post-date">
            <Date dateString={postData.date} />
          </div>
        </div>
        <div className="post-content" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>

      <aside className="sidebar">
        <h2>文章目录</h2>
        <div className="table-of-contents">
          {/* 这里可以添加文章目录 */}
        </div>
      </aside>
    </div>
  )
}

export async function getStaticPaths() {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id)
  return {
    props: {
      postData
    }
  }
} 