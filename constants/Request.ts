type user = {
    username: string
    password: string | null
    token: string | null
}

type book = {
    book_id: string | null
    title: string | null
    author: string | null
}

type lib = {
    lib_id: string | null
    lib_name: string | null
}


type Request = {
    user: user
    book: book | null
    lib: lib | null
}

export default Request