import React from 'react';
import WebsiteFrame from 'components/WebsiteFrame/WebsiteFrame';
import MobileFrame from 'components/MobileFrame/MobileFrame';
import { RichText } from 'prismic-reactjs';
import VideoNode from '../../../../components/VideoNode/VideoNode';
import './Columns.css';

const Columns = (props) => {
  const data = props.data.value
    ? props.data.value[0] // v1 structure
    : props.data.primary; // v2 structure

  const imageIsRight = data.right != null;
  const is2of3 = data.layout === '-column--2of3';
  const is1of3 = (
    data.layout === '-column--1of3' ||
    data.layout === '-mobile' ||
    data.layout === '-website'
  );

  const classes = [
    'caseStudy__colBlock',
    '-grid',
    '-wrap',
    imageIsRight
      ? 'caseStudy__colBlock--right'
      : null,
    is2of3
      ? 'caseStudy__colBlock--largeImage'
      : null,
    is1of3
      ? 'caseStudy__colBlock--smallImage'
      : null,
  ].join(' ');

  const { image } = data;
  const idealSize = 'size_1024';
  const imgSrc = image[idealSize]
    ? image[idealSize].url
    : image.url;

  const columnMedia = (
    data.video.url
      ? <VideoNode muteToggle={data.audio === 'true'} url={data.video.url} />
      : <img src={imgSrc} alt={props.title} />);

  const columnText = (
    <div className="caseStudy__colBlock__col caseStudy__colBlock__col--text -padding" key="col-img">
      {RichText.render(data.text)}
    </div>
  );

  const columnItems = [
    // this div used to be a <Parallax />
    <div speed={4} className="caseStudy__colBlock__col caseStudy__colBlock__col--media -padding" key="col-media">
      {(() => {
        if (data.layout === '-website') {
          return <WebsiteFrame render={columnMedia} />;
        } else if (data.layout === '-mobile') {
          return <MobileFrame>{columnMedia}</MobileFrame>;
        }
        return columnMedia;
      })()}
    </div>,
    columnText,
  ];

  return (
    <div className={classes}>
      { imageIsRight ? columnItems.reverse() : columnItems }
    </div>);
};

export default Columns;
