import React, { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './FooterBlog.module.scss';
import SubTitle from '~/components/Layout/SubTitle/SubTitle';
import LoadingIndicator from '~/components/Loading';
import { getDetailPostFooter } from '~/api/home';

const cx = classNames.bind(styles);

function FooterBlog() {
  const { slug } = useParams();
  const [postDetail, setPostDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const data = await getDetailPostFooter(slug);
        setPostDetail(data);
      } catch (error) {
        console.error('Error fetching post detail:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPostDetail();
    }
  }, [slug]);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <SubTitle title={'Chi tiết bài viết'} />
      <div className={cx('title-blog')}>{postDetail.name}</div>
      <div className={cx('blog-content')}>
        {postDetail ? (
          <div dangerouslySetInnerHTML={{ __html: postDetail.content }} />
        ) : (
          <div className={cx('blog-error')}>Không tìm thấy bài viết</div>
        )}
      </div>
    </>
  );
}

export default memo(FooterBlog);
