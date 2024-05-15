export type SearchProps = {};

export const Search = (props: SearchProps) => {
  return (
    <div>
      <input type="text" placeholder="Search..." />
      <button>Search</button>
    </div>
  );
};
