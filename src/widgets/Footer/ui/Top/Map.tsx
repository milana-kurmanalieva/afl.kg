import React from 'react';
import classes from './top.module.scss';


export const Map = () => {
  return (
    <div className={classes.map}>
      <iframe
        // eslint-disable-next-line max-len
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2926.314790475744!2d74.6262516!3d42.8239639!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x389eb5cb715a9be3%3A0x5fd4520183b0c646!2sPolya%20Dlya%20Mini%20Futbola!5e0!3m2!1sen!2skg!4v1681303748382!5m2!1sen!2skg"
        width="100%"
        height="100%"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};
