document.addEventListener("DOMContentLoaded", async () => {
  // Fetch articles from JSON file
  const response = await fetch("/data/articles.json");
  const articles = await response.json();

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