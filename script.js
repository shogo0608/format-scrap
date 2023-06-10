document.addEventListener("DOMContentLoaded", function() {
    // format author list
    document.getElementById("author_button").addEventListener("click", function() {
        var author = document.getElementById("author").value;
        let author_list = author.split(", ");
        var formatted_author_list = [];
        for (let i in author_list) {
            formatted_author_list[i] = "#" + author_list[i].replace(" ", "_");
        }
        var formatted_author = formatted_author_list.join(" ");
        document.getElementById("formatted_author").innerHTML = formatted_author;
    });

    // format japanese abstract
    document.getElementById("abstract_button").addEventListener("click", function() {
        var abstract = document.getElementById("abstract").value;
        var dictionary = {
            "、": "，",
            "。": "．",
            " \\(": "（",
            "\\(": "（",
            "\\) ": "）",
            "\\)": "）",
            "なりました": "なった",
            "なります．": "なる．",
            "します．": "する．",
            "いました．": "った．",
            "ました．": "た．",
            "ます．": "る．",
            "です．": "である．",
        }
        var formatted_abstract = abstract;
        for (let key in dictionary) {
            formatted_abstract = formatted_abstract.replace(
                new RegExp(key, "g"), dictionary[key]
            );
            console.log(formatted_abstract)
        }
        p_head = new RegExp(
            "([\u3041-\u3096]|[\u30A1-\u30FA]|[々〇〻\u3400-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF])([a-zA-Z0-9])", 
            "g"
        );
        p_tail = new RegExp(
            "([a-zA-Z0-9])([\u3041-\u3096]|[\u30A1-\u30FA]|[々〇〻\u3400-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF])", 
            "g"
        );
        formatted_abstract = formatted_abstract.replace(p_head, "$1 $2");
        formatted_abstract = formatted_abstract.replace(p_tail, "$1 $2");
        document.getElementById("preformatted_abstract").innerHTML = abstract;
        document.getElementById("formatted_abstract").innerHTML = formatted_abstract;
    });

    // format bibliography of arXiv article
    document.getElementById("arxiv_button").addEventListener("click", function() {
        // get HTML of arXiv article from link
        var arxiv_url = document.getElementById("arxiv_url").value;
        var arxiv_id = arxiv_url.split("/").slice(-1)[0];
        var arxiv_api_url = "https://export.arxiv.org/api/query?id_list=" + arxiv_id;
        var arxiv_article = "";
        fetch(arxiv_api_url)
            .then(response => response.text())
            .then(data => {
                var parser = new DOMParser();
                var xml = parser.parseFromString(data, "text/xml");
                var entry = xml.getElementsByTagName("entry")[0];
                var title = entry.getElementsByTagName("title")[0].innerHTML;
                var authors = entry.getElementsByTagName("author");
                var author_list = [];
                for (let i = 0; i < authors.length; i++) {
                    author_list[i] = authors[i].getElementsByTagName("name")[0].innerHTML;
                }
                var formatted_author_list = [];
                for (let i in author_list) {
                    formatted_author_list[i] = "#" + author_list[i].replace(" ", "_");
                }
                var formatted_author = formatted_author_list.join(" ");
                var published = entry.getElementsByTagName("published")[0].innerHTML;
                var published_year = published.split("-")[0];
                var summary = entry.getElementsByTagName("summary")[0].innerHTML;
                var link = entry.getElementsByTagName("link")[0].getAttribute("href");
                var arxiv_article = [
                    title, 
                    formatted_author, 
                    summary, 
                    link
                ].join("\n");
                document.getElementById("arxiv_article").innerHTML = arxiv_article;
            });
    });
}, false);