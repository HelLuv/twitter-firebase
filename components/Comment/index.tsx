import * as React from 'react';

interface CommentProps {
  id: string,
  comment: any
}

const Comment: React.FC<CommentProps> = ({comment, id}) => {
  // TODO: Comment
  return (
    <li className="text-white">{comment.comment}</li>
  )
};

export default React.memo<CommentProps>(Comment);