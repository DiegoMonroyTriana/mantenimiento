function Title ({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">{children}</h1>
      <hr className="border-black/20" />
    </div>
  )
}

export default Title
