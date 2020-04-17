
import { useState } from 'react';
import BaseLayout from '@/layouts/BaseLayout';
import { useGetTopicsByCategory, useGetUser } from '@/apollo/actions';
import { useRouter } from 'next/router';
import withApollo from '@/hoc/withApollo';
import { getDataFromTree } from '@apollo/react-ssr';
import Replier from '@/components/shared/Replier';

const useInitialData = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { data: dataT } = useGetTopicsByCategory({variables: {category: slug}});
  const { data: dataU } = useGetUser();
  const topicsByCategory = (dataT && dataT.topicsByCategory) || [];
  const user = (dataU && dataU.user) || null;

  return {topicsByCategory, user };
}

const Topics = () => {
  const [ isReplierOpen, setReplierOpen] = useState(false);
  const { topicsByCategory, user } = useInitialData();

  return (
    <BaseLayout>
      <section className="section-title">
        <div className="px-2">
          <div className="pt-5 pb-4">
            <h1>Select a Topic</h1>
            <button
              onClick={() => setReplierOpen(true)}
              disabled={!user}
              className="btn btn-primary">
              Create Topic
            </button>
            {!user && <i className="ml-2">Log in to create topic</i>}
          </div>
        </div>
      </section>
      <section className="fj-topic-list">
        <table className="table table-hover ">
          <thead>
            <tr>
              <th scope="col">Topic</th>
              <th scope="col">Category</th>
              <th scope="col">Author</th>
            </tr>
          </thead>
          <tbody>
            { topicsByCategory.map(topic =>
              <tr key={topic._id}>
                <th>{topic.title}</th>
                <td className="category">{topic.forumCategory.title}</td>
                <td>{topic.user.username}</td>
              </tr>
              )
            }
          </tbody>
        </table>
      </section>
      <Replier isOpen={isReplierOpen}/>
    </BaseLayout>
  )
}

export default withApollo(Topics, {getDataFromTree});
