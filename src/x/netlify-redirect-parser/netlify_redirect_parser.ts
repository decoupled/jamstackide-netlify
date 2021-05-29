import { outputFile } from "fs-extra"
import * as nrp from "netlify-redirect-parser"
import * as tmp from "tmp"

export interface NetlifyRedirectParserResult {
  success: Redirect[]
  errors: Error[]
}

interface Redirect {
  path: string
  to: string
  status?: number
  force?: boolean
  params?: Record<string, string>
  conditions?: Record<string, string>
}

interface Error {
  lineNum: number
  line: string
}

export function netlify_redirect_parser_from_file(
  filePath: string
): Promise<NetlifyRedirectParserResult> {
  return nrp.parseRedirectsFormat(filePath)
}

export async function netlify_redirect_parser_from_source(
  src: string
): Promise<NetlifyRedirectParserResult> {
  const f = tmp.fileSync()
  try {
    await outputFile(f.name, src)
    return await netlify_redirect_parser_from_file(f.name)
  } finally {
    f.removeCallback()
  }
}

{
  // redirects_file_parser_raw(`/  /china 302 Country=ch,tw`)
  // const ok1 = redirects_file_parser_raw(
  //   `/path/* param1=:value1 param2=:value2 /otherpath/:value1/:value2/:splat 301`
  // )
  const r = await netlify_redirect_parser_from_source(
    `
    /path param1=:value1 param2=:value2 /otherpath/:value1/:value2/:splat 301
    
    `
  )
  r
  console.log(typeof r)
  Object.keys(r)
  console.log("succ", r.success)
  console.log("err", r.errors)
}

const example1: NetlifyRedirectParserResult = {
  success: [
    {
      path: "/path",
      to: "/otherpath/:value1/:value2/:splat",
      params: {
        param1: ":value1",
        param2: ":value2",
      },
      status: 301,
    },
  ],
  errors: [],
}

const example2: NetlifyRedirectParserResult = {
  success: [
    {
      path: "/",
      to: "/china",
      status: 302,
      conditions: {
        Country: "ch,tw",
      },
    },
    {
      path: "/10thmagnitude",
      to: "http://www.10thmagnitude.com/",
      status: 301,
      force: true,
    },
    {
      path: "/bananastand",
      to: "http://eepurl.com/Lgde5",
      status: 301,
      force: true,
    },
    {
      path: "/conf",
      to:
        "https://docs.google.com/forms/d/1wMBXPjAcofBDqnRhKbM5KhzUbGPoxqRQZs6O_TEBa_Q/viewform?usp=send_form",
      status: 301,
      force: true,
    },
    {
      path: "/gpm",
      to:
        "https://goo.gl/app/playmusic?ibi=com.google.PlayMusic&isi=691797987&ius=googleplaymusic&link=https://play.google.com/music/m/Ihj4yege3lfmp3vs5yoopgxijpi?t=Arrested_DevOps",
      status: 301,
      force: true,
    },
    {
      path: "/googleplay",
      to:
        "https://goo.gl/app/playmusic?ibi=com.google.PlayMusic&isi=691797987&ius=googleplaymusic&link=https://play.google.com/music/m/Ihj4yege3lfmp3vs5yoopgxijpi?t=Arrested_DevOps",
      status: 301,
      force: true,
    },
    {
      path: "/google-play-music",
      to:
        "https://goo.gl/app/playmusic?ibi=com.google.PlayMusic&isi=691797987&ius=googleplaymusic&link=https://play.google.com/music/m/Ihj4yege3lfmp3vs5yoopgxijpi?t=Arrested_DevOps",
      status: 301,
      force: true,
    },
    {
      path: "/google",
      to:
        "https://goo.gl/app/playmusic?ibi=com.google.PlayMusic&isi=691797987&ius=googleplaymusic&link=https://play.google.com/music/m/Ihj4yege3lfmp3vs5yoopgxijpi?t=Arrested_DevOps",
      status: 301,
      force: true,
    },
    {
      path: "/playmusic",
      to:
        "https://goo.gl/app/playmusic?ibi=com.google.PlayMusic&isi=691797987&ius=googleplaymusic&link=https://play.google.com/music/m/Ihj4yege3lfmp3vs5yoopgxijpi?t=Arrested_DevOps",
      status: 301,
      force: true,
    },
    {
      path: "/google-play",
      to:
        "https://goo.gl/app/playmusic?ibi=com.google.PlayMusic&isi=691797987&ius=googleplaymusic&link=https://play.google.com/music/m/Ihj4yege3lfmp3vs5yoopgxijpi?t=Arrested_DevOps",
      status: 301,
      force: true,
    },
    {
      path: "/guestform",
      to:
        "https://docs.google.com/forms/d/1zqG3fEyugSQLt-yKJNsPpgqDr0Akl8hD_z4DaGdzuOI/viewform?usp=send_form",
      status: 301,
      force: true,
    },
    {
      path: "/iphone",
      to: "http://itunes.apple.com/us/app/arrested-devops/id963732227",
      status: 301,
      force: true,
    },
    {
      path: "/itunes",
      to:
        "https://itunes.apple.com/us/podcast/arrested-devops/id773888088?mt=2&uo=4&at=11lsCi",
      status: 301,
      force: true,
    },
    {
      path: "/iTunes",
      to:
        "https://itunes.apple.com/us/podcast/arrested-devops/id773888088?mt=2&uo=4&at=11lsCi",
      status: 301,
      force: true,
    },
    {
      path: "/mailinglist",
      to: "http://eepurl.com/Lgde5",
      status: 301,
      force: true,
    },
    {
      path: "/sponsorschedule",
      to:
        "http://docs.google.com/spreadsheets/d/1wkWhmSIC_WYultwRb6jfQijrfS1x44YIyCV_pBJxgRQ/pubhtml?gid=67301010&single=true",
      status: 301,
      force: true,
    },
    {
      path: "/stackexchange",
      to:
        "http://careers.stackoverflow.com/jobs/employer/Stack Exchange?searchTerm=Reliability",
      status: 301,
      force: true,
    },
    {
      path: "/tenthmagnitude",
      to: "http://www.10thmagnitude.com/",
      status: 301,
      force: true,
    },
    {
      path: "/xm",
      to: "http://www.10thmagnitude.com/",
      status: 301,
      force: true,
    },
    {
      path: "/codeship",
      to:
        "http://www.codeship.io/arresteddevops?utm_source=arresteddevops&utm_medium=podcast&utm_campaign=ArrestedDevOpsPodcast",
      status: 301,
      force: true,
    },
    {
      path: "/datadog",
      to:
        "https://www.datadoghq.com/lpgs/?utm_source=Advertisement&utm_medium=Advertisement&utm_campaign=ArrestedDevops-Tshirt",
      status: 301,
      force: true,
    },
    {
      path: "/loggly",
      to:
        "https://www.loggly.com/?utm_source=arresteddevops&utm_medium=podcast&utm_campaign=1",
      status: 301,
      force: true,
    },
    {
      path: "/redgate",
      to:
        "http://www.red-gate.com/products/dlm/?utm_source=arresteddevops&utm_medium=displayad&utm_content=dlm&utm_campaign=dlm&utm_term=podcast-22752",
      status: 301,
      force: true,
    },
    {
      path: "/trueability",
      to: "http://linux.trueability.com",
      status: 301,
      force: true,
    },
    {
      path: "/hired",
      to:
        "https://hired.com/?utm_source=podcast&utm_medium=arresteddevops&utm_campaign=q2-16&utm_term=cat-tech-devops",
      status: 301,
      force: true,
    },
    {
      path: "/stickers",
      to: "https://www.stickermule.com/user/1070633194/stickers",
      status: 301,
      force: true,
    },
    {
      path: "/chefcommunity",
      to: "https://summit.chef.io",
      status: 301,
      force: true,
    },
  ],
  errors: [
    {
      lineNum: 2,
      line: "&^*&*(  )",
    },
  ],
}
