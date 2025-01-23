import React from "react";
import LinkCard from "./LinkCard";

interface LinkItem {
  id: number;
  name: string;
  icon: string;
  href: string;
  iconColor: string;
}

interface LinkListProps {
  links: LinkItem[];
  onDelete: (id: number) => void;
  onOpen: (url: string) => void;
}

const LinkList: React.FC<LinkListProps> = ({ links, onDelete, onOpen }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
      {links.map((link) => (
        <LinkCard
          key={link.id}
          link={link}
          onDelete={onDelete}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
};

export default LinkList;
