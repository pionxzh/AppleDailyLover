async function getPage () {
    const html = await fetch(document.location.href)
    return html.text()
}

function hidePayWall () {
    $('.ndPaywall').remove()
    $('.ndPaywallVideo').remove()
    $('.ndPaywallHeader').remove()
}

function showContent () {
    hidePayWall()
    $('.ndAritcle_headPic,.ndArticle_margin,.mediabox,#playerVideo,.articulum').show()

    // check is these element exist to prevent execute before page loaded
    return !!$('.ndAritcle_headPic,.ndArticle_margin,.mediabox,#playerVideo,.articulum').length

}

document.addEventListener('readystatechange', (event) => {
    if (document.readyState == 'complete') {
        // The hiding function should stop here
        showContent()

        let count = 0
        let tv = setInterval(() => {
            count++
            if (showContent() || count > 20) {
                clearInterval(tv)
                console.log('😋 Done!')
            }
        }, 500)
    }
})

async function init () {
    // Stop the old page
    window.stop()

    let html = await getPage()
    // console.log(html)

    // Remove effects() function
    let newPage = html.replace(/effects\(.{0,15}\)/g, '')
    // Handle HK version, remove uReadDisplayMsgBox()
    newPage = newPage.replace(/uReadDisplayMsgBox\(false\);/, '')
    // Remove hash element
    newPage = newPage.replace(/<[a-zA-Z0-9]{33}-[a-zA-Z0-9]{32}.*?>/, '')

    document.open()
    document.write(newPage)
    document.close()
}

init()
