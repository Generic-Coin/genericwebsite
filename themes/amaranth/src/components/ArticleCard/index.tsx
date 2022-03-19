import React from "react";
import { Types } from "gatsby-theme-advanced";

import { H3 } from "../../theme";
import { TransparentLink } from "../Links";
import ArticleCardSkeleton from "./Skeleton";
import FolderIcon from "./folder.png"
import * as S from "./styles";

const folderIcon = FolderIcon as string;

type ArticleHeroCardProps = {
  post?: Types.Post;
};


const ArticleCard = ({ post }: ArticleHeroCardProps): JSX.Element => {
  // If no post is provided, render a skeleton view with a loading animation
  if (!post) return <ArticleCardSkeleton />;

  return (
    <TransparentLink to={post.slug}>
      {/* Display as an H2 for accessibility and title semantics */}
        <H3 as="h2"><S.Folder><img className="foldericon" alt="" src={folderIcon} /></S.Folder>{post.title}</H3>
    </TransparentLink>
    // <S.Wrapper hero={hero}>
    //   <TransparentLink to={post.slug} ariaLabel={post.title}>
    //     <S.Cover
    //       image={getImage(post.coverImg) as IGatsbyImageData}
    //       alt={post.coverImageAlt}
    //     />
    //   </TransparentLink>
    //   <S.Details hero={hero}>
    //     <S.Meta>
    //       <S.Header>
    //         <ArticleInfo post={post} />
    //         <TransparentLink to={post.slug}>
    //           {/* Display as an H2 for accessibility and title semantics */}
    //           <H3 as="h2">{post.title}</H3>
    //         </TransparentLink>
    //       </S.Header>
    //       <TransparentLink to={post.slug} ariaLabel={post.title}>
    //         <S.Excerpt hero={hero}>{post.excerpt}</S.Excerpt>
    //       </TransparentLink>
    //     </S.Meta>
    //     {hero && <ReadButton to={post.slug} />}
    //   </S.Details>
    // </S.Wrapper>
  );
};

export default ArticleCard;
