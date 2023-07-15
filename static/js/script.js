function create_button(id, text, func) {
    var button = document.createElement("button");
    button.classList.add("button")
    button.id = id;
    button.innerHTML = text;
    button.addEventListener("click", func);
    return button;
}

function copy_to_clipboard(str) {
    return function() {
        navigator.clipboard.writeText(str);
    }
}

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
        document.getElementById("copy_author").replaceWith(
            create_button(
                "copy_author", "Copy", 
                copy_to_clipboard(formatted_author)
            )
        );
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
        document.getElementById("formatted_abstract").innerHTML = (
            "[*** Abstract]<br>" + formatted_abstract
        );
        document.getElementById("copy_abstract").replaceWith(
            create_button(
                "copy_abstract", "Copy", 
                copy_to_clipboard("[*** Abstract]\n" + formatted_abstract)
            )
        );
    });

    // format bibliography of arXiv article
    document.getElementById("arxiv_button").addEventListener("click", function() {
        // get HTML of arXiv article from link
        var arxiv_url = document.getElementById("arxiv_url").value;
        var arxiv_id = arxiv_url.split("/").slice(-1)[0];
        var arxiv_api_url = (
            "https://export.arxiv.org/api/query?id_list=" + arxiv_id
        );
        fetch(arxiv_api_url)
            .then(response => response.text())
            .then(data => {
                var parser = new DOMParser();
                var xml = parser.parseFromString(data, "text/xml");
                var entry = xml.getElementsByTagName("entry")[0];
                // get title
                var title = entry.getElementsByTagName("title")[0].innerHTML;
                title = title.trim().replace(/\r?\n /g, "")
                // get author list
                var authors = entry.getElementsByTagName("author");
                var author_list = [];
                for (let i = 0; i < authors.length; i++) {
                    author_list[i] = authors[i].getElementsByTagName("name")[0];
                    author_list[i] = author_list[i].innerHTML;
                }
                var formatted_author_list = [];
                for (let i in author_list) {
                    formatted_author_list[i] = (
                        "#" + author_list[i].replace(" ", "_")
                    );
                }
                var formatted_author = formatted_author_list.join(" ");
                // get published year
                var published = entry.getElementsByTagName("published")[0];
                published = published.innerHTML;
                var published_year = published.split("-")[0];
                // get summary
                var summary = entry.getElementsByTagName("summary")[0];
                summary = summary.innerHTML.trim().replace(/\n/g, " ");
                var summary_for_deepl = encodeURIComponent(summary)
                var deepl_link = (
                    "https://deepl.com/translator#en/ja/" + summary_for_deepl
                );
                console.log(summary)
                // format bibliography
                var bibliography = (
                    "#arXiv #" + published_year + "\n" + formatted_author + "\n\n"
                    + "Links:\nPaper: " + arxiv_url
                );
                // output formatted bibliography
                document.getElementById("arxiv_result").style.visibility = "visible";
                document.getElementById("arxiv_title").innerHTML = title;
                document.getElementById("arxiv_published_year").innerHTML = published_year;
                document.getElementById("arxiv_authors").innerHTML = formatted_author;
                document.getElementById("arxiv_paper_link").innerHTML = arxiv_url;
                document.getElementById("arxiv_abstract").innerHTML = summary;
                document.getElementById("arxiv_deepl").href = deepl_link;
                // set copy buttons
                var title_button = create_button(
                    "arxiv_copy_title", "Copy",
                    copy_to_clipboard(title)
                );
                var bibliography_button = create_button(
                    "arxiv_copy_bibliography", "Copy",
                    copy_to_clipboard(bibliography)
                );
                document.getElementById("arxiv_copy_title").replaceWith(
                    title_button
                );
                document.getElementById("arxiv_copy_bibliography").replaceWith(
                    bibliography_button
                );
        });
    });
}, false);

