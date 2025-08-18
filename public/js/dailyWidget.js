document.addEventListener("DOMContentLoaded", () => {
  const articles = [
    {
      title: "A Relational Model of Data for Large Shared Data Banks",
      author: "E.F. Codd (1970)",
      url: "https://www.seas.upenn.edu/~zives/03f/cis550/codd.pdf",
      area: "Databases",
    },
    {
      title: "Attention Is All You Need",
      author: "Vaswani et al. (2017)",
      url: "https://arxiv.org/abs/1706.03762",
      area: "AI",
    },
    {
      title: "MapReduce: Simplified Data Processing on Large Clusters",
      author: "Dean & Ghemawat (2004)",
      url: "https://research.google/pubs/pub-2789/",
      area: "Databases",
    },
    {
      title: "The Anatomy of a Large-Scale Hypertextual Web Search Engine",
      author: "Brin & Page (1998)",
      url: "http://infolab.stanford.edu/~backrub/google.html",
      area: "Databases",
    },
    {
      title: "Deep Residual Learning for Image Recognition",
      author: "He et al. (2015)",
      url: "https://arxiv.org/abs/1512.03385",
      area: "AI",
    },
  ];

  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
  );
  const articleIndex = dayOfYear % articles.length;
  const dailyArticle = articles[articleIndex];

  const titleElement = document.getElementById("article-title");
  const authorElement = document.getElementById("article-author");

  if (titleElement && authorElement) {
    titleElement.href = dailyArticle.url;
    titleElement.textContent = dailyArticle.title;
    authorElement.textContent = `${dailyArticle.author} — [${dailyArticle.area}]`;
  }
});