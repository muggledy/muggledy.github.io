const CACHE_NAME = 'MuggledyBlogCacheHelper';
let cachelist = ["/404.html"];

const blog_default_version = '1.0.27'

self.cons = {
    s: (m) => {
        //console.log(`%c[SUCCESS]%c ${m}`, 'color:white;background:green;', '')
    },
    w: (m) => {
        //console.log(`%c[WARNING]%c ${m}`, 'color:brown;background:yellow;', '')
    },
    i: (m) => {
        //console.log(`%c[INFO]%c ${m}`, 'color:white;background:blue;', '')
    },
    e: (m) => {
        //console.log(`%c[ERROR]%c ${m}`, 'color:white;background:red;', '')
    },
    d: (m) => {
        //console.log(`%c[DEBUG]%c ${m}`, 'color:white;background:black;', '')
    }
}

self.db = {
    read: (key, config) => {
        if (!config) { config = { type: "text" } }
        return new Promise((resolve, reject) => {
            caches.open(CACHE_NAME).then(cache => {
                cache.match(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`)).then(function (res) {
                    if (!res) resolve(null)
                    res.text().then(text => resolve(text))
                }).catch(() => {
                    resolve(null)
                })
            })
        })
    },
    write: (key, value) => {
        return new Promise((resolve, reject) => {
            caches.open(CACHE_NAME).then(function (cache) {
                cache.put(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`), new Response(value));
                resolve()
            }).catch(() => {
                reject()
            })
        })
    }
}

const generate_uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

self.addEventListener('activate', async function (installEvent) {
    self.clients.claim()
})

self.addEventListener('install', async function (installEvent) {
    self.skipWaiting();

    installEvent.waitUntil(
        caches.open(CACHE_NAME)
            .then(async function (cache) {
                if (!await db.read('uuid')) {
                    await db.write('uuid', generate_uuid())
                }
                return cache.addAll(cachelist);
            })
    );
});

const handleerr = async (req, msg) => {
    return new Response(`<h1>MuggledyBlogCacheHelper Error</h1>
    <b>${msg}</b>`, { headers: { "content-type": "text/html; charset=utf-8" } })
}

//每一项譬如gh项中的所有cdn必须能够相互转换，如果不能，则需要特殊处理
//unpkg_version项特别用于_config.butterfly.yml中诸如vue, jquery, pjax等unpkg cdn资源的加速，尽量确保这些重量级js依赖库能够最先最快地加载完毕
let cdn = {
    "gh": {
        statically: {
            "url": "https://cdn.statically.io/gh"
        },
        jsdelivr: {
            "url": "https://cdn.jsdelivr.net/gh"
        }, //或许替换为https://fastly.jsdelivr.net/gh会更稳定些
        githack: {
            "url": "https://rawcdn.githack.com"
        } //直接从GitHub，Bitbucket或GitLab提供原始文件(http://raw.githack.com/)，用法类似staticaly(但不支持min最小化)，see https://www.31du.cn/blog/jsdelivr.html
    },
    "combine": {
        jsdelivr: {
            "url": "https://cdn.jsdelivr.net/combine"
        }
    },
    "unpkg_version": {
        unpkg: {
            "url": "https://unpkg.com"
        },
        jsdelivr: {
            "url": "https://cdn.jsdelivr.net/npm"
        },
        eleme: {
            "url": "https://npm.elemecdn.com"
        },
        jjz: {
            "url": "https://jsd.onmicrosoft.cn/npm"
        },
        sourceg: {
            "url": "https://npm.sourcegcdn.com"
        },
        cloudflare: {
            "url": "https://cdnjs.cloudflare.com/ajax/libs"
        }, //cloudflare和上面五个（前五个可直接转换）需要特殊处理才能互转
        bootcss: {
            "url": "https://cdn.bootcss.com"
        } //bootcss和cloudflare直接转换
    },
    "npm": {
        eleme: {
            "url": "https://npm.elemecdn.com"
        },
        jsdelivr: {
            "url": "https://cdn.jsdelivr.net/npm"
        },
        jjz: {
            "url": "https://jsd.onmicrosoft.cn/npm"
        },
        jjz_unpkg: {
            "url": "https://npkg.onmicrosoft.cn"
        },
        sourceg: {
            "url": "https://npm.sourcegcdn.com"
        },
        GNT: {
            "url": "https://cdn.bilicdn.tk/npm"
        },
    }
}

const handle = async function (req) {
    set_blog_config(await db.read('blog_version') || blog_default_version)
    const reqdata = await req.clone()
    const urlStr = req.url
    let urlObj = new URL(urlStr)
    const uuid = await db.read('uuid')
    const pathname = urlObj.href.substr(urlObj.origin.length)
    const domain = (urlStr.split('/'))[2]
    if (pathname.match(/\/sw\.js/g)) { return fetch(req) }
    const query = q => urlObj.searchParams.get(q)
    let urls = []
    let url_tmp = null
    let jsdelivr_repo = null //unpkg_repo
    let staticaly_repo = null //cloudflare_repo
    let temp = null
    let msg = JSON.parse(await db.read('msg')) || (async () => { await db.write('msg', '[]'); return '[]' })()
    const nqurl = urlStr.split('?')[0]
    const nqreq = new Request(nqurl)
    const cache_delete = async (url) => {
        const cache = await caches.open(CACHE_NAME)
        await cache.delete(url)
    }
    if (query('nosw') == 'true') {
        return fetch(req)
    }
    if (query('delete') == 'true') {
        cache_delete(nqreq);
        msg.push(
            {
                "name": "文件已删除",
                "time": new Date(),
                "info": `已删除${nqurl}`
            }
        )
        await db.write('msg', JSON.stringify(msg))
        return new Response(JSON.stringify({ ok: 1 }))
    }
    //update cache
    if (query('forceupdate') == 'true') {
        msg.push(
            {
                "name": "文件已强制更新",
                "time": new Date(),
                "info": `已更新${nqurl}`
            }
        )
        await db.write('msg', JSON.stringify(msg))
        await fetch(req).then(function (res) {
            return caches.open(CACHE_NAME).then(function (cache) {
                cache_delete(nqreq);
                cache.put(req, res.clone());
                return res;
            });
        });
        return new Response(JSON.stringify({ ok: 1 }))
    }
    //intercept cdn link request
    for (let i in cdn) {
        for (let j in cdn[i]) {
            if (domain == cdn[i][j].url.split('https://')[1].split('/')[0] && urlStr.match(cdn[i][j].url)) {
                urls = []
                for (let k in cdn[i]) {
                    url_tmp = urlStr.replace(cdn[i][j].url, cdn[i][k].url)
                    /* demo: https://cdn.statically.io/gh/celestezj/pangu.js/master/dist/browser/pangu.min.js ->
                       https://cdn.jsdelivr.net/gh/celestezj/pangu.js/master/dist/browser/pangu.min.js is invalid 
                       demo: https://cdn.jsdelivr.net/gh/celestezj/ImageHosting/img/20210207093620.ico is ok
                       but when convert to https://cdn.statically.io/gh/celestezj/ImageHosting/img/20210207093620.ico
                       it will be invalid
                       因此两者的相互转换需要特殊处理
                    */
                    if (i === "gh") {
                        /*convert from staticaly/githack to jsdelivr*/
                        if (url_tmp.match("https://cdn.jsdelivr.net/gh") && !urlStr.match("https://cdn.jsdelivr.net/gh")) {
                            jsdelivr_repo = url_tmp.split("https://")[1].split("/")
                            if (jsdelivr_repo[3].match("@") === null) { //this if is no needed
                                url_tmp = url_tmp.replace(`${jsdelivr_repo[2]}/${jsdelivr_repo[3]}/`, `${jsdelivr_repo[2]}/${jsdelivr_repo[3]}@`)
                            }
                        } else if (url_tmp.match("https://cdn.statically.io/gh") && urlStr.match("https://cdn.jsdelivr.net/gh")) { /*convert from jsdelivr to staticaly*/
                            staticaly_repo = url_tmp.split("https://")[1].split("/")
                            if (staticaly_repo[3].match("@") !== null) {
                                url_tmp = url_tmp.replace(`${staticaly_repo[2]}/${staticaly_repo[3]}/`, `${staticaly_repo[2]}/${staticaly_repo[3].split("@").join("/")}/`)
                            } else {
                                url_tmp = url_tmp.replace(`${staticaly_repo[2]}/${staticaly_repo[3]}/`, `${staticaly_repo[2]}/${staticaly_repo[3]}/master/`) //假定缺省分支名为master，但不一定正确
                            }
                        } else if (url_tmp.match("https://rawcdn.githack.com") && !urlStr.match("https://rawcdn.githack.com")) {
                            staticaly_repo = url_tmp.split("https://")[1].split("/")
                            if (urlStr.match("https://cdn.jsdelivr.net/gh")) { /*convert from jsdelivr to githack*/
                                if (staticaly_repo[2].match("@") !== null) {
                                    url_tmp = url_tmp.replace(`${staticaly_repo[1]}/${staticaly_repo[2]}/`, `${staticaly_repo[1]}/${staticaly_repo[2].split("@").join("/")}/`)
                                } else {
                                    url_tmp = url_tmp.replace(`${staticaly_repo[1]}/${staticaly_repo[2]}/`, `${staticaly_repo[1]}/${staticaly_repo[2]}/master/`)
                                }
                            }
                            /*https://rawcdn.githack.com/celestezj/ImageHosting/master/data/git_calendar/gitcalendar.min.js is invalid
                              but https://rawcdn.githack.com/celestezj/ImageHosting/master/data/swiper/swiper.min.css is valid*/
                            if ((staticaly_repo[staticaly_repo.length-1].endsWith(".min.js") || staticaly_repo[staticaly_repo.length-1].endsWith(".min.css")) && 
                                !(staticaly_repo[1] === 'celestezj' && 
                                (/\b(swiper.min.css|swiper.min.js|swiper_init.min.js|APlayer.min.js|APlayer.min.css|all.min.css|font-awesome-animation.min.css|buttons.min.css|Valine.min.js|activate-power-mode.min.js)\b/)
                                    .test(staticaly_repo[staticaly_repo.length-1]))) {
                                url_tmp = url_tmp.replace(/(.*).min.(js|css)/, '$1.$2')
                            }
                        }
                    } else if (i === "unpkg_version") {
                        /* demo: https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.15.2/katex.min.css ->
                           https://unpkg.com/katex@0.15.2/dist/katex.min.css */
                        if (url_tmp.match("https://cdnjs.cloudflare.com/ajax/libs") && !(urlStr.match("https://cdnjs.cloudflare.com/ajax/libs") 
                                    || urlStr.match("https://cdn.bootcss.com"))) { /*convert from unpkg/eleme/etc. to cloudflare*/
                            staticaly_repo = url_tmp.split("https://")[1].split("/")
                            if (staticaly_repo[3].startsWith("@")) {
                                /*https://unpkg.com/@fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js(urlStr) -> https://cdnjs.cloudflare.com/ajax/libs/@fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js(url_tmp)
                                 is invalid, we need to delete @fancyapps/ firstly*/
                                url_tmp = url_tmp.replace(`${staticaly_repo[3]}/`, "")
                                staticaly_repo = url_tmp.split("https://")[1].split("/")
                            }
                            if (staticaly_repo[3].match("@") !== null) {
                                temp = url_tmp.replace(`${staticaly_repo[2]}/${staticaly_repo[3]}/${staticaly_repo[3].split("@")[0] === "typed.js" ? "lib" : "dist"}/`, 
                                    `${staticaly_repo[2]}/${staticaly_repo[3].split("@").join("/")}/`)
                                if (temp === url_tmp) {
                                    /*https://unpkg.com/blueimp-md5@2.17.0/js/md5.min.js -> https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5@2.17.0/js/md5.min.js is invalid, this case cannot be converted in reverse*/
                                    url_tmp = url_tmp.replace(`${staticaly_repo[2]}/${staticaly_repo[3]}/`, `${staticaly_repo[2]}/${staticaly_repo[3].split("@").join("/")}/`)
                                } else { url_tmp = temp }
                            } else { continue }
                        } else if (url_tmp.match("https://cdn.bootcss.com") && !(urlStr.match("https://cdnjs.cloudflare.com/ajax/libs") 
                                || urlStr.match("https://cdn.bootcss.com"))) { /*convert from unpkg/eleme/etc. to bootcss*/
                            staticaly_repo = url_tmp.split("https://")[1].split("/")
                            if (staticaly_repo[1].startsWith("@")) {
                                url_tmp = url_tmp.replace(`${staticaly_repo[1]}/`, "")
                                staticaly_repo = url_tmp.split("https://")[1].split("/")
                            }
                            if (staticaly_repo[1].match("@") !== null) {
                                temp = url_tmp.replace(`${staticaly_repo[0]}/${staticaly_repo[1]}/${staticaly_repo[1].split("@")[0] === "typed.js" ? "lib" : "dist"}/`,
                                    `${staticaly_repo[0]}/${staticaly_repo[1].split("@").join("/")}/`)
                                if (temp === url_tmp) {
                                    url_tmp = url_tmp.replace(`${staticaly_repo[0]}/${staticaly_repo[1]}/`, `${staticaly_repo[0]}/${staticaly_repo[1].split("@").join("/")}/`)
                                } else { url_tmp = temp }
                            } else { continue }
                        } else if (!(url_tmp.match("https://cdnjs.cloudflare.com/ajax/libs") || url_tmp.match("https://cdn.bootcss.com")) 
                                && (urlStr.match("https://cdnjs.cloudflare.com/ajax/libs") || urlStr.match("https://cdn.bootcss.com"))) { /*convert from cloudflare/bootcss to unpkg/eleme/etc.*/
                            jsdelivr_repo = url_tmp.split("https://")[1].split("/")
                            if (url_tmp.match("https://cdn.jsdelivr.net/npm") || url_tmp.match("https://jsd.onmicrosoft.cn/npm")) {
                                url_tmp = url_tmp.replace(`${jsdelivr_repo[2]}/${jsdelivr_repo[3]}/`, 
                                    `${jsdelivr_repo[2].toLowerCase()}@${jsdelivr_repo[3]}/${jsdelivr_repo[2] === "typed.js" ? "lib" : "dist"}/`) //大多数转换后unpkg路径都是在dist/下，也有些不是（type.js就在lib/路径），只能遇到逐一加规则区分
                            } else {
                                url_tmp = url_tmp.replace(`${jsdelivr_repo[1]}/${jsdelivr_repo[2]}/`, 
                                    `${jsdelivr_repo[1].toLowerCase()}@${jsdelivr_repo[2]}/${jsdelivr_repo[1] === "typed.js" ? "lib" : "dist"}/`)        
                            }
                        }
                    }
                    urls.push(url_tmp)
                }
                if (!await privconf.read('cache')) return lfetch(urls, urlStr)
                return caches.match(req).then(function (resp) {
                    return resp || lfetch(urls, urlStr).then(function (res) {
                        return caches.open(CACHE_NAME).then(function (cache) {
                            cache.put(req, res.clone());
                            return res;
                        });
                    });
                })
            }
        }
    }
    for (var i in blog.origin) {
        if (domain.split(":")[0] == blog.origin[i].split(":")[0]) {
            if (blog.local) { return fetch(req) }
            setTimeout(async () => {
                await set_newest_blogver()
            }, 30 * 1000);
            urls = []
            for (let k in blog.plus) {
                urls.push(`https://${blog.plus[k]}` + fullpath(pathname))
            }
            for (let k in blog.npmmirror) {
                urls.push(blog.npmmirror[k] + fullpath(pathname))
            }
            const generate_blog_html = async (res) => {
                return new Response(await res.arrayBuffer(), {
                    headers: {
                        'Content-Type': 'text/html;charset=utf-8'
                    },
                    status: res.status,
                    statusText: res.statusText
                })
            }
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    caches.match(req).then(function (resp) {
                        if (!!resp) {
                            cons.s(`Cache Hited! | Origin:${urlStr}`)
                            setTimeout(() => {
                                resolve(resp)
                            }, 200);
                            setTimeout(() => {
                                lfetch(urls, urlStr).then(async function (res) {
                                    return caches.open(CACHE_NAME).then(async function (cache) {
                                        cache.delete(req);
                                        cons.s(`Cache Updated! | Origin:${urlStr}`)
                                        if (fullpath(pathname).match(/\.html$/g)) {
                                            const NewRes = await generate_blog_html(res)
                                            cache.put(req, NewRes.clone());
                                            resolve(NewRes)
                                        } else {
                                            cache.put(req, res.clone());
                                            resolve(res)
                                        }
                                    });
                                });
                            }, 0);
                        } else {
                            cons.w(`Cache Missed! | Origin:${urlStr}`)
                            setTimeout(() => {
                                lfetch(urls, urlStr).then(async function (res) {
                                    return caches.open(CACHE_NAME).then(async function (cache) {
                                        if (fullpath(pathname).match(/\.html$/g)) {
                                            const NewRes = await generate_blog_html(res)
                                            cache.put(req, NewRes.clone());
                                            resolve(NewRes)
                                        } else {
                                            cache.put(req, res.clone());
                                            resolve(res)
                                        }
                                    });
                                }).catch(function (err) {
                                    resolve(caches.match(new Request('/404.html')))
                                })
                            }, 0);
                            setTimeout(() => {
                                resolve(caches.match(new Request('/404.html')))
                            }, 5000);
                        }
                    })
                }, 0);
            })
        }
    }
    return fetch(req)
}

const lfetch = async (urls, url) => {
    cons.i(`LFetch Handled! | Mirrors Count:${urls.length} | Origin: ${url}`)
    //console.log(urls)
    const t1 = new Date().getTime()
    const uuid = await db.read('uuid')
    if (!await privconf.read('mirror')) {
        return fetch(url)
    }
    if (!Promise.any) {
        Promise.any = function (promises) {
            return new Promise((resolve, reject) => {
                promises = Array.isArray(promises) ? promises : []
                let len = promises.length
                let errs = []
                if (len === 0) return reject(new AggregateError('All promises were rejected'))
                promises.forEach((promise) => {
                    promise.then(value => {
                        resolve(value)
                    }, err => {
                        len--
                        errs.push(err)
                        if (len === 0) {
                            reject(new AggregateError(errs))
                        }
                    })
                })
            })
        }
    }
    let controller = new AbortController();
    const PauseProgress = async (res) => {
        return new Response(await (res).arrayBuffer(), { status: res.status, headers: res.headers });
    };
    let results = Promise.any(urls.map(async urls => {
        return new Promise(async (resolve, reject) => {
            fetch(urls, {
                signal: controller.signal
            })
                .then(PauseProgress)
                .then(async res => {
                    const resn = res.clone()
                    if (resn.status == 200) {
                        setTimeout(async () => {
                            try {
                                db.write('HIT_HOT', await (async () => {
                                    const hit = await (async () => { try { return JSON.parse(await db.read('HIT_HOT')) || { site: {}, static: {} } } catch (e) { return { site: {}, static: {} } } })()
                                    const domain = urls.split('/')[2]
                                    hit[domain] = hit[domain] ? hit[domain] + 1 : 1
                                    if (blog.plus.indexOf(domain) > -1) {
                                        hit.site[domain] = hit.site[domain] ? hit.site[domain] + 1 : 1
                                    } else {
                                        hit.static[domain] = hit.static[domain] ? hit.static[domain] + 1 : 1
                                    }
                                    return JSON.stringify(hit)
                                })());
                                db.write('HIT_HOT_SIZE', await (async () => {
                                    const hit = await (async () => { try { return JSON.parse(await db.read('HIT_HOT_SIZE')) || { site: {}, static: {} } } catch (e) { return { site: {}, static: {} } } })()
                                    const domain = urls.split('/')[2]
                                    hit[domain] = hit[domain] ? hit[domain] + Number(res.headers.get('Content-Length')) : Number(res.headers.get('Content-Length'))
                                    if (blog.plus.indexOf(domain) > -1) {
                                        hit.site[domain] = hit.site[domain] ? hit.site[domain] + Number(res.headers.get('Content-Length')) : Number(res.headers.get('Content-Length'))
                                    } else {
                                        hit.static[domain] = hit.static[domain] ? hit.static[domain] + Number(res.headers.get('Content-Length')) : Number(res.headers.get('Content-Length'))
                                    }
                                    return JSON.stringify(hit)
                                })())
                            } catch (n) { }
                        }, 0);
                        controller.abort();
                        cons.s(`LFetch Success! | Time: ${new Date().getTime() - t1}ms | Origin: ${url} `)
                        resolve(resn)
                    } else {
                        reject(null)
                    }
                }).catch((e) => {
                    if (String(e).match('The user aborted a request') || String(e).match('Failed to fetch')) {
                        //console.log(e)
                    } else if (String(e).match('been blocked by CORS policy')) {
                        cons.e(`LFetch Blocked by CORS policy! | Origin: ${url}`)
                    }
                    else {
                        cons.e(`LFetch Error! | Origin: ${url} | Resean: ${e}`)
                    }
                    reject(null)
                })
        }
        )
    }
    )).then(res => { return res }).catch(() => { return null })
    return results
}

const privconf = {
    read: async (key) => {
        try {
            const priv_config = JSON.parse(await db.read('priv_config') || '{}')
            return typeof priv_config[key] === 'boolean' ? priv_config[key] : (key == "globalcompute" ? false : true)
        } catch (e) {
            return true
        }
    },
    change: async (key) => {
        const priv_config = JSON.parse(await db.read('priv_config') || '{}')
        if (typeof priv_config[key] != 'boolean') priv_config[key] = true
        priv_config[key] = !priv_config[key]
        await db.write('priv_config', JSON.stringify(priv_config))
    }
}

const fullpath = (path) => {
    path = path.split('?')[0].split('#')[0]
    if (path.match(/\/$/)) {
        path += 'index'
    }
    if (!path.match(/\.[a-zA-Z]+$/)) {
        path += '.html'
    }
    return path
}

const set_blog_config = (version) => {
    self.packagename = "muggledy-blog-html"
    self.blogversion = version
    self.blog = {
        local: 0, //1 for hexo local debug, when deploy to internet, must set to 0
        origin: [
            "muggledy.top",
            "muggledy.github.io",
            "localhost:4000",
            "127.0.0.1:4000"
        ],
        plus: [
            "vercel.muggledy.top"
        ], //plus站点中的页面除了cdn链接，都不会被sw拦截并行请求，勉强可以认为plus站点不受sw影响
        npmmirror: [
            `https://unpkg.com/${packagename}@${blogversion}`,
            `https://npm.elemecdn.com/${packagename}@${blogversion}`,
            `https://cdn.jsdelivr.net/npm/${packagename}@${blogversion}`,
            `https://cdn-jsd.pigax.cn/npm/${packagename}@${blogversion}`,
            `https://fastly.jsdelivr.net/npm/${packagename}@${blogversion}`,
            `https://testingcf.jsdelivr.net/npm/${packagename}@${blogversion}`,
            `https://originfastly.jsdelivr.net/npm/${packagename}@${blogversion}`,
            `https://gcore.jsdelivr.net/npm/${packagename}@${blogversion}`,
            `https://quantil.jsdelivr.net/npm/${packagename}@${blogversion}`
        ] //https://91ai.net/thread-975880-1-1.html
    };
}

const set_newest_blogver = async () => {
    self.packagename = "muggledy-blog-html"
    const mirror = [
        `https://registry.npmjs.org/${packagename}/latest`,
        `https://mirrors.cloud.tencent.com/npm/${packagename}/latest`,
        //`https://registry.npmmirror.com/${packagename}/latest` //the latest version get from mirrorsite may be old
    ]
    //cons.i(`Searching For The Newest Version Of Blog...`)
    return lfetch(mirror, mirror[0])
        .then(res => res.json())
        .then(async res => {
            if (!res.version) throw ('No Version Found!')
            const gVer = choose_the_newest_version(res.version, await db.read('blog_version') || blog_default_version)
            cons.d(`Newest Version: ${res.version} ; Local Version: ${await db.read('blog_version')} | Update answer: ${gVer}`)
            //cons.s(`Update Blog Version To ${gVer}`);
            await db.write('blog_version', gVer)
            set_blog_config(gVer)
        })
        .catch(e => {
            cons.e(`Get Blog Newest Version Erorr!Reseon:${e}`);
            set_blog_config(blog_default_version)
        })
}

const choose_the_newest_version = (g1, g2) => {
    const spliter = (v) => {
        const fpart = v.split('.')[0]
        return [parseInt(fpart), v.replace(fpart + '.', '')]
    }
    const compare_npmversion = (v1, v2) => {
        const [n1, s1] = spliter(v1)
        const [n2, s2] = spliter(v2)
        //cons.d(`n1:${n1} s1:${s1} n2:${n2} s2:${s2}`)
        if (n1 > n2) {
            return g1
        } else if (n1 < n2) {
            return g2
        } else if (!s1.match(/\./) && !s2.match(/\./)) {
            if (parseInt(s1) > parseInt(s2)) return g1
            else return g2
        } else {
            return compare_npmversion(s1, s2)
        }
    }
    return compare_npmversion(g1, g2)
}

setInterval(async () => {
    //cons.i('Trying to fetch the newest blog version...')
    await set_newest_blogver()
}, 120 * 1000);
setTimeout(async () => {
    await set_newest_blogver()
}, 1000);

self.addEventListener('fetch', async event => {
    try {
        event.respondWith(handle(event.request))
    } catch (msg) {
        event.respondWith(handleerr(event.request, msg))
    }
});

//see https://blog.cyfan.top/p/d3c51290.html
//https://kmar.top/posts/73014407/
