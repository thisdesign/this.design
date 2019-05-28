import Prismic from 'prismic-javascript';
import { useState, useEffect } from 'react';

export default function useApi({ context }) {
  const [state, setState] = useState();

  async function getData() {
    const api = await Prismic.api('https://thisstaging.prismic.io/api/v2');

    const caseStudies = await api
      .query([Prismic.Predicates.at('document.type', 'casestudy')], {
        pageSize: 100,
      })
      .then(res => res.results);

    console.log(context);
    const contextUids = await api
      .getByUID('context', context || 'home')
      .then(doc => doc)
      .then(res => res.data.case_study_list.map(cs => cs.case_study_item.uid));

    const contextCaseStudies = contextUids.map(
      uid => caseStudies[caseStudies.map(data => data.uid).indexOf(uid)]
    );

    const caseStudyUids = caseStudies.map(cs => cs.uid);

    const siteInfo = await api.getSingle('site').then(doc => doc.data);

    const about = await api.getSingle('about').then(doc => doc.data);

    setState({
      caseStudyUids,
      contextCaseStudies,
      contextUids,
      caseStudies,
      siteInfo,
      about,
      api,
    });
  }

  useEffect(() => {
    getData();
  }, []);

  return state;
}
