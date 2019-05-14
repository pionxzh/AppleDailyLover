const PRESERVE_IDS = [
    'playerVideo',
    'video_player'
]

const PRESERVE_CLASSES = [
    'ndAritcle_headPic',
    'ndArticle_margin',
    'mediabox',
    'articulum'
]

let PRESERVED_ELEMENTS = {}

function injectScript (text) {
    let script = document.createElement('script')
    script.textContent = text
    document.body.append(script)
}

async function getPage() {
    let html = await fetch(document.location.href)
    return html.text()
}

/*
function preserveNode(html) {
    PRESERVE_IDS.forEach(id => {
        PRESERVED_ELEMENTS[id] = $(backup).find(`#${id}`).show()
    })

    PRESERVE_CLASSES.forEach(className => {
        PRESERVED_ELEMENTS[className] = $(backup).find(`.${className}`).show()
    })
}
*/

// Remove element contain the blocking text
function removeElContain (text) {
    $(element).find('*').filter(function() {
        return this.nodeType == Node.TEXT_NODE
    }).filter(function() {
        return this.nodeValue.includes(text)
    }).remove()

    return element
}

// Retrieve all the child to find the hash element
function removeHashEl (element) {
    $(element).find('*').filter(function() {
        return $(this).prop('tagName').match(/<[a-zA-Z0-9]{33}-[a-zA-Z0-9]{32}.*?>/)
    }).remove()

    return element
}

function preserveNode(node) {
    PRESERVE_IDS.forEach(id => {
        let element = $(node).show().addClass('love-apple-daily').clone()
        if (id === $(node).attr('id')) {
            PRESERVED_ELEMENTS[id] = element
        }
    })

    PRESERVE_CLASSES.forEach(className => {
        const nodeClass = $(node).attr('class') || ''
        if (nodeClass.includes(className)) {
            let element = $(node).show().addClass('love-apple-daily').clone()

            element = removeHashEl(element)

            if (className === 'ndArticle_margin') {
                element = removeElContain('「蘋果新聞網APP」')
                element = removeElContain('有話要說 投稿「即時論壇」')
                $(element).find('iframe').remove()
            }

            PRESERVED_ELEMENTS[className] = element
        }
    })
}

function hidePayWall () {
    $('.ndPaywallHeader').remove()
    $('.ndPaywall').remove()
    $('.ndPaywallVideo').remove()
}

function reconstructVideo () {
    try {
        let videoData = null
        if (PRESERVED_ELEMENTS['video_player'] !== undefined) {
            videoData = PRESERVED_ELEMENTS['video_player'].find('script').data('anvp')
        } else if (PRESERVED_ELEMENTS['playerVideo'] !== undefined) {
            console.log(PRESERVED_ELEMENTS['playerVideo'].get(0).outerHTML)
            videoData = PRESERVED_ELEMENTS['playerVideo'].children()[0].children().last().data('anvp')
        } else {
            // No video data found
            return
        }

        // Reconstruct video content
        let source = document.createElement('source')
        source.src = videoData['url']
        source.type = 'video/mp4'

        let video = document.createElement('video')
        video.width = parseInt(videoData['width'], 10)
        video.height = parseInt(videoData['height'], 10)
        video.autoplay = false
        video.controls = true
        video.appendChild(source)
        video.load()

        $('#videobox').hide()
        $('.thoracis').append(video)
    } catch (e) {
        console.error(e)
    }
}

function reconstructArticle () {
    // $('.thoracis').prepend(PRESERVED_ELEMENTS['ndAritcle_headPic'])
    $('.ndArticle_contentBox').before(PRESERVED_ELEMENTS['ndAritcle_headPic'])

    // $('.thoracis').append(PRESERVED_ELEMENTS['mediabox'])
    $('.abdominis').append(PRESERVED_ELEMENTS['articulum'])
    $('.ndArticle_content').prepend(PRESERVED_ELEMENTS['ndArticle_margin'])

    console.log('😋 Done!')
}

function showContent () {
    hidePayWall()
    reconstructVideo()
    reconstructArticle()
}


$(document).ready(function() {
    /*
    let html = getPage()
    let backup = $.parseHTML(html)
    preserveNode(backup)

    const newsContentHTML = $(newsContent).get(0).outerHTML
    */
})


document.addEventListener('readystatechange', (event) => {
    if (document.readyState == 'complete') {
        // The hiding function should stop here
        showContent()
    }
})

async function init () {
    let config = {childList: true, subtree: true}
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type != 'childList') return

            // Preserve content node
            for (let i = 0; i < mutation.removedNodes.length; i++) {
                preserveNode(mutation.removedNodes[i])
            }
        })
    })
    observer.observe(document, config)
}

init()
