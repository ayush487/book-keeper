const modal = document.getElementById('modal')
const modalShow = document.getElementById('show-modal')
const modalClose = document.getElementById('close-modal')
const bookmarkForm = document.getElementById('bookmark-form')
const websiteNameEl = document.getElementById('website-name')
const websiteUrlEl = document.getElementById('website-url')
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = []

// Show Modal, Focus on Input
const showModal = () => {
    modal.classList.add('show-modal')
    websiteNameEl.focus();
}
const closeModal = () => {
    modal.classList.remove('show-modal')
    websiteNameEl.value = ''
    websiteUrlEl.value = ''
}

// Modal Event Listeners
modalShow.addEventListener('click', showModal)
modalClose.addEventListener('click', closeModal)
window.addEventListener('click', (e) => (e.target===modal) ? closeModal() : false)

// Validate Form
const validate = (nameValue, urlValue) => {
    if(!nameValue || !urlValue){
        alert('Please submit values for both fields')
        return false
    }
    const expression = /(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
    const regex = new RegExp(expression)
    if(!urlValue.match(regex)) {
        alert('Please provide a valid web address')
        return false
    }
    return true
}

// Build Bookmarks DOM
const buildBookmarks = () => {
    // Remove all bookmark elements
    bookmarksContainer.textContent = ''
    // Build items
    bookmarks.forEach((bookmark) => {
        const {name, url} = bookmark
        // Item
        const item = document.createElement('div')
        item.classList.add('item')
        const closeIcon = document.createElement('i')
        closeIcon.classList.add('fas', 'fa-times')
        closeIcon.setAttribute('title', 'Delete Bookmark')
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`)
        // Favicon / Link Container
        const linkInfo = document.createElement('div')
        linkInfo.classList.add('name')
        const favicon = document.createElement('img')
        favicon.setAttribute('src', `https://www.google.com/s2/favicons?sz=64&domain_url=${url}`)
        favicon.setAttribute('alt', 'favicon')
        // Link
        const link = document.createElement('a')
        link.setAttribute('href', `${url}`)
        link.setAttribute('target', '_blank')
        link.textContent = name
        // Append to bookmarks container
        linkInfo.append(favicon,link)
        item.append(closeIcon, linkInfo)
        bookmarksContainer.appendChild(item)
    })
}

// Fetch Bookmarks
const fetchBookmarks = () => {
    // Get Bookmarks from localStorage is available
    if(localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // Create bookmarks array in localStorage
        bookmarks [
            {
                name: 'Jacinto Design',
                url: 'https://jacito.design'
            }
        ]
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks()
}

// Delete Bookmark
const deleteBookmark = (url) => {
    bookmarks.forEach((bookmark, i) => {
        if(bookmark.url === url) {
            bookmarks.splice(i,1);
        }
    } )
    // Update bookmarks array in localStorage, re populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    fetchBookmarks()
}

// Handle Data from Form
const storeBookmark = (e) => {
    e.preventDefault()
    const nameValue = websiteNameEl.value
    let urlValue = websiteUrlEl.value
    if(!urlValue.includes('http://') && !urlValue.includes('http://')){
        urlValue = `https://${urlValue}`
    }
    if(!validate(nameValue, urlValue)){
        return false
    }
    const bookmark = {
        name: nameValue,
        url: urlValue
    }
    bookmarks.push(bookmark)
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    fetchBookmarks()
    bookmarkForm.reset()
    websiteNameEl.focus()
}

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark)

// On Load, Fetch Bookmarks
fetchBookmarks()