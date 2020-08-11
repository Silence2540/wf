// import diary2018 from '../blog/2018/1.json'
/*日志展示*/
let indexNum = 0 //首页展示的文章条数
let allBlog = [] //所有日志
let allSign = []
let allSignStr = ''
let timer = null
const blog2020 = function (data) {
  showDiary(data)
}
const blog2018 = function (data) {
  showDiary(data)
}

function showDiary(data){
  let dom = document.getElementsByClassName('diary')[0]
  let isDetail = dom === undefined
  if(isDetail) {
    dom = document.getElementsByClassName('diary-detail')[0]
  }
  data.forEach((item,index) => {
    getSignType(item)

    item.itemId = `${item.time}(${index})`
    allBlog.push({
      time: item.time,
      itemId: item.itemId,
      title: item.title,
      sign: item.sign,
      content: item.content.slice(0,160)+'...'
    })
    let content = isDetail ? item.content : item.content.slice(0,160)+'...'
    let url = window.location.href
    let itemId = ''
    if(url.split('?blog=').length>1) {
      /*详情页显示的内容*/
      itemId = url.split('?blog=')[1]
      if(itemId === item.itemId) {
        let newDom = document.createElement('div')
        let domStr= `<div class="diary-item diary-detail-item"><div class="title">${item.title}</div><div class="sign"><span class="iconfont icon-riqi time">${item.time}</span>`
        item.sign.forEach(inner => {
          domStr+=`<a href="./blog-list.html?type=${inner}" target="_blank" class="iconfont icon-biaoqian tag">${inner}</a>`
        })
        domStr+=`</div><pre class="content showDiary">${content}</pre>`
        let currentBlog = [...allBlog]
        setTimeout(() => {
          domStr+='<div class="next-blog">'
          let len = currentBlog.length
          if(len>1) {
           domStr+=`<span>上一篇：<a class="before-btn" href="./blog-detail.html?blog=${currentBlog[len-2].itemId}">${currentBlog[len-2].title}</a></span>`
          }
          if(len<allBlog.length) {
            domStr+=`<span>下一篇：<a class="after-btn" href="./blog-detail.html?blog=${allBlog[len].itemId}">${allBlog[len].title}</a></span>`
          }
          domStr+='</div></div>'
          newDom.innerHTML = domStr
          dom&&dom.appendChild(newDom)
        },1)
      }

    } else {
      /*首页显示的内容*/
      if(indexNum<10) {
       let newDom = getLogList(item,content)
        dom&&dom.appendChild(newDom)
      }
    }
    indexNum++
  })
  timer = setTimeout(() =>{
    getClassification()
    clearTimeout((timer))
  },1)

}

/*日志列表*/

function getLogList(item,content) {
  let newDom = document.createElement('div')
  let domStr= `<div class="diary-item"><div class="title">${item.title}</div><div class="sign"><span class="iconfont icon-riqi time">${item.time}</span>`
  item.sign.forEach(inner => {
    domStr+=`<a href="./blog-list.html?type=${inner}" target="_blank" class="iconfont icon-biaoqian tag">${inner}</a>`
  })
  domStr+=`</div><pre class="content showDiary">${content}</pre><a class="btn" href="./blog-detail.html?blog=${item.itemId}" target="_blank">阅读更多</a></div>`
  newDom.innerHTML = domStr
  return newDom
}

/*统计标签*/
function getSignType(item) {
  if(allSign.length===0) {
    item.sign.forEach(innerSign => {
      allSign.push({
        sign: innerSign,
        num: 1
      })
      allSignStr+= `${innerSign};`
    })
  } else {
    item.sign.forEach(innerSign => {
      if(allSignStr.indexOf(innerSign)>-1) {
        allSign.forEach(sign => {
          if(sign.sign === innerSign) {
            sign.num++
          }
        })
      }else {
        allSignStr+= `${innerSign};`
        allSign.push({
          sign: innerSign,
          num: 1
        })
      }
    })
  }
}

/*分类*/
function getClassification() {
  let dom = document.getElementsByClassName('diary-list')[0]
  if(dom===undefined) return
  let url = window.location.href
  if(url.split('?type=').length>1) {
    url = url.split('?type=')[1]
    console.log(allBlog)
    allBlog.forEach(item => {
      item.sign.forEach(inner => {
        if (url === inner) {
          let newDom = getLogList(item, item.content)
          dom.appendChild(newDom)
        }
      })
    })
  }
}