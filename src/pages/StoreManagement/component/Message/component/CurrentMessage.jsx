import React, { memo } from 'react';
import classNames from 'classnames/bind';
import styles from '../Message.module.scss';
import { images, imagesSeller } from '~/assets/images';

const cx = classNames.bind(styles);

function CurrentMessage() {
  return (
    <>
      <div className={cx('box-chat')}>
        {/* Message area */}
        <div className={cx('message', 'received')}>
          <img src={imagesSeller.seller_avatar} alt="Avatar" className={cx('avatar')} />
          <p className={cx('message-content')}>Hey!</p>
        </div>
        <div className={cx('message', 'sent')}>
          <p className={cx('message-content')}>
            Hey, we haven't seen each other in like 2 weeks hahaha do you want to grab coffee nearby?
          </p>
        </div>
        <div className={cx('message', 'sent')}>
          <p className={cx('message-content')}>
            I just need to find some time on my calendar since I have been so busy, and I know we both have!
          </p>
        </div>
        <div className={cx('message', 'received')}>
          <img src={imagesSeller.seller_avatar} alt="Avatar" className={cx('avatar')} />
          <p className={cx('message-content')}>
            I just need to find some time on my calendar since I have been so busy, and I know we both have! ed to find
            some time on my calendar since I have been so busy, and I know we both have! ed to find some time on my
            calendar since I have been so busy, and I know we both have! ed to find some time on my calendar since I
            have been so busy, and I know we both have!
          </p>
        </div>
        <div className={cx('message', 'received')}>
          <img src={imagesSeller.seller_avatar} alt="Avatar" className={cx('avatar')} />
          <p className={cx('message-content')}>Hey!</p>
        </div>
        <div className={cx('message', 'sent')}>
          <p className={cx('message-content')}>
            Hey, we haven't seen each other in like 2 weeks hahaha do you want to grab coffee nearby?
          </p>
        </div>
        <div className={cx('message', 'sent')}>
          <p className={cx('message-content')}>
            I just need to find some time on my calendar since I have been so busy, and I know we both have!
          </p>
        </div>
        <div className={cx('message', 'received')}>
          <img src={imagesSeller.seller_avatar} alt="Avatar" className={cx('avatar')} />
          <p className={cx('message-content')}>
            I just need to find some time on my calendar since I have been so busy, and I know we both have! ed to find
            some time on my calendar since I have been so busy, and I know we both have! ed to find some time on my
            calendar since I have been so busy, and I know we both have! ed to find some time on my calendar since I
            have been so busy, and I know we both have!
          </p>
        </div>
        <div className={cx('message', 'received')}>
          <img src={imagesSeller.seller_avatar} alt="Avatar" className={cx('avatar')} />
          <p className={cx('message-content')}>Hey!</p>
        </div>
        <div className={cx('message', 'sent')}>
          <p className={cx('message-content')}>
            Hey, we haven't seen each other in like 2 weeks hahaha do you want to grab coffee nearby?
          </p>
        </div>
        <div className={cx('message', 'sent')}>
          <p className={cx('message-content')}>
            I just need to find some time on my calendar since I have been so busy, and I know we both have!
          </p>
        </div>
        <div className={cx('message', 'received')}>
          <img src={imagesSeller.seller_avatar} alt="Avatar" className={cx('avatar')} />
          <p className={cx('message-content')}>
            I just need to find some time on my calendar since I have been so busy, and I know we both have! ed to find
            some time on my calendar since I have been so busy, and I know we both have! ed to find some time on my
            calendar since I have been so busy, and I know we both have! ed to find some time on my calendar since I
            have been so busy, and I know we both have!
          </p>
        </div>
        <div className={cx('message', 'received')}>
          <img src={imagesSeller.seller_avatar} alt="Avatar" className={cx('avatar')} />
          <p className={cx('message-content')}>Hey!</p>
        </div>
        <div className={cx('message', 'sent')}>
          <p className={cx('message-content')}>
            Hey, we haven't seen each other in like 2 weeks hahaha do you want to grab coffee nearby?
          </p>
        </div>
        <div className={cx('message', 'sent')}>
          <p className={cx('message-content')}>
            I just need to find some time on my calendar since I have been so busy, and I know we both have!
          </p>
        </div>
        <div className={cx('message', 'received')}>
          <img src={imagesSeller.seller_avatar} alt="Avatar" className={cx('avatar')} />
          <p className={cx('message-content')}>
            I just need to find some time on my calendar since I have been so busy, and I know we both have! ed to find
            some time on my calendar since I have been so busy, and I know we both have! ed to find some time on my
            calendar since I have been so busy, and I know we both have! ed to find some time on my calendar since I
            have been so busy, and I know we both have!
          </p>
        </div>
        <div className={cx('message', 'received')}>
          <img src={imagesSeller.seller_avatar} alt="Avatar" className={cx('avatar')} />
          <p className={cx('message-content')}>Hey!</p>
        </div>
        <div className={cx('message', 'sent')}>
          <p className={cx('message-content')}>
            Hey, we haven't seen each other in like 2 weeks hahaha do you want to grab coffee nearby?
          </p>
        </div>
        <div className={cx('message', 'sent')}>
          <p className={cx('message-content')}>
            I just need to find some time on my calendar since I have been so busy, and I know we both have!
          </p>
        </div>
        <div className={cx('message', 'received')}>
          <img src={imagesSeller.seller_avatar} alt="Avatar" className={cx('avatar')} />
          <p className={cx('message-content')}>
            I just need to find some time on my calendar since I have been so busy, and I know we both have! ed to find
            some time on my calendar since I have been so busy, and I know we both have! ed to find some time on my
            calendar since I have been so busy, and I know we both have! ed to find some time on my calendar since I
            have been so busy, and I know we both have!
          </p>
        </div>
        <div className={cx('message', 'received')}>
          <img src={imagesSeller.seller_avatar} alt="Avatar" className={cx('avatar')} />
          <p className={cx('message-content')}>Hey!</p>
        </div>
        <div className={cx('message', 'sent')}>
          <p className={cx('message-content')}>
            Hey, we haven't seen each other in like 2 weeks hahaha do you want to grab coffee nearby?
          </p>
        </div>
        <div className={cx('message', 'sent')}>
          <p className={cx('message-content')}>
            I just need to find some time on my calendar since I have been so busy, and I know we both have!
          </p>
        </div>
        <div className={cx('message', 'received')}>
          <img src={imagesSeller.seller_avatar} alt="Avatar" className={cx('avatar')} />
          <p className={cx('message-content')}>
            I just need to find some time on my calendar since I have been so busy, and I know we both have! ed to find
            some time on my calendar since I have been so busy, and I know we both have! ed to find some time on my
            calendar since I have been so busy, and I know we both have! ed to find some time on my calendar since I
            have been so busy, and I know we both have!
          </p>
        </div>
      </div>

      <div className={cx('input-message')}>
        <img src={images.attach_file} alt="attach file" className={cx('attach-file')} />
        <div className={cx('input-wrapper')}>
          <input type="text" placeholder="Message" className={cx('input')} />
          <button className={cx('send-button')}>
            <img src={images.send_message} alt="send message" className={cx('send-message-icon')} />
          </button>
        </div>
        <img src={images.record} alt="record" className={cx('record')} />
      </div>
    </>
  );
}

export default memo(CurrentMessage);
