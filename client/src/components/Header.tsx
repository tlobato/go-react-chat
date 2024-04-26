import GithubIcon from "./Icons/Github";

export default function Header() {
  return (
    <header className="bg-neutral-900 fixed top-0 w-full h-16 px-4 items-center justify-between flex">
      <h1 className="text-3xl font-semibold">go-react-chat</h1>
      <nav>
        <a
          href="https://github.com/tomaslobato/go-react-chat"
        >
          <GithubIcon />
        </a>
      </nav>
    </header>
  );
}
