import { auth } from "@/auth";
import request from "@/lib/request";
import { endpoint } from "@/lib/url";
import { User } from "@prisma/client";

export default async function Home() {
  const users = await request.get(endpoint.appApi + 'user/all')

  const session = await auth()
  return (
    <>
    <div>
      ページ一覧
      <ul>
        {
          PathList.map((path, index) => {
            return (
              <li key={path.path}>
                <a className="text-blue-600" href={path.path}>{path.path}</a>：{path.text}
              </li>
            )
          })
        }
      </ul>
    </div>
    <div className="py-12">
      ユーザーデータ取得↓
      <ul>
        {
          users.data?.map((user: User) => {
            return (
              <li className="py-6" key={user.id}>
                <p>id: {user.id}</p>
                <p>name: {user.name}</p>
                <p>email: {user.email}</p>
              </li>
            )
          })
        }
      </ul>
    </div>
    <div className="py-12">
        <p>セッション情報｜サーバーサイドでセッション取得（@auth）</p>
        <pre className="py-6 px-4 whitespace-pre-wrap break-all">
            {JSON.stringify(session, null, 2)}
        </pre>
    </div>
    </>
  );
}

const PathList = [
  {
    path: "/",
    text: "",
  },
  {
    path: "/mypage",
    text: 'ログインユーザーのみ'
  },
  {
    path: "/client",
    text: ''
  },
  {
    path: "/signin",
    text: ''
  },
  {
    path: "/signup",
    text: ''
  },
  {
    path: "/password/reset",
    text: ''
  },
  {
    path: "/admin",
    text: '管理者ユーザーのみ'
  },
  {
    path: "/admin/signin",
    text: ''
  },
  {
    path: "/admin/signup",
    text: ''
  }
]