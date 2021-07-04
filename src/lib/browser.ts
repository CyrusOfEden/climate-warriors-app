export const scrollToBottom = () =>
  window.scroll({
    left: 0,
    top: document.body.scrollHeight || document.documentElement.scrollHeight,
    behavior: "smooth",
  })
