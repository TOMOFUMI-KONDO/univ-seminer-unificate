/**
 * ページタイトル設定
 * @param pathTitle
 * @returns {string|string}
 */
export const setTitle = pathTitle => {
    const siteTitle = '東北大セミナー情報まとめ'
    const pageTitle = pathTitle ? pathTitle + ' | ' + siteTitle : siteTitle
    return (document.title = pageTitle)
}

export const globalMixins = {
    methods: {
        setTitle,
    }
}