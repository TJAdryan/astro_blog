import { p as createVNode, G as Fragment, _ as __astro_tag_component__ } from "./astro/server_C7Z9Vbd7.mjs";
import "clsx";
const frontmatter = {
  "title": "From Raw Data to Polished Insights: A Guide to the Medallion Architecture",
  "description": "Learn how the Medallion Architecture transforms raw data into polished insights through a structured, repeatable process.",
  "pubDate": "2025-09-29T00:00:00.000Z",
  "ttags": ["Data Science", "Medallion Architecture", "GWAS Catalog", "Data Engineering"],
  "image": "/images/trait_counts_chart.png",
  "draft": false
};
function getHeadings() {
  return [{
    "depth": 3,
    "slug": "from-raw-data-to-polished-insights-a-guide-to-the-medallion-architecture",
    "text": "From Raw Data to Polished Insights: A Guide to the Medallion Architecture"
  }, {
    "depth": 3,
    "slug": "the-bronze-layer-the-raw-collection",
    "text": "The Bronze Layer: The Raw Collection"
  }, {
    "depth": 3,
    "slug": "the-silver-layer-the-first-shine",
    "text": "The Silver Layer: The First Shine"
  }, {
    "depth": 3,
    "slug": "the-gold-layer-the-final-gleam",
    "text": "The Gold Layer: The Final Gleam"
  }];
}
function _createMdxContent(props) {
  const _components = {
    a: "a",
    br: "br",
    code: "code",
    h3: "h3",
    hr: "hr",
    li: "li",
    ol: "ol",
    p: "p",
    pre: "pre",
    span: "span",
    strong: "strong",
    ul: "ul",
    ...props.components
  };
  return createVNode(Fragment, {
    children: [createVNode(_components.h3, {
      id: "from-raw-data-to-polished-insights-a-guide-to-the-medallion-architecture",
      children: "From Raw Data to Polished Insights: A Guide to the Medallion Architecture"
    }), "\n", createVNode(_components.p, {
      children: ["Hearing about a new design pattern or concept can feel overwhelming sometimes.  But once you look at it, it is really a simple idea, that you were probably already using.", createVNode(_components.br, {}), "\nThat is how I feel about Medallion Architecture. Most projects you work on involve cleaning data, usually in the early stages.  The very nature of data is that it is not always going to be collected in a uniform way.\nThis makes having a formalized process for cleaning and structuring the data you are using very important\nThe Medallion Architecture is a way to take a more formalized and structured approact to what you were already doing. Encouraging you to document and iterate the process."]
    }), "\n", createVNode(_components.hr, {}), "\n", createVNode(_components.h3, {
      id: "the-bronze-layer-the-raw-collection",
      children: "The Bronze Layer: The Raw Collection"
    }), "\n", createVNode(_components.p, {
      children: ["The Bronze layer is where all the raw materials arrive. For our project, we used the ", createVNode(_components.strong, {
        children: "GWAS Catalog"
      }), ", a public database of published genetic research findings from the European Bioinformatics Institute and the National Human Genome Research Institute."]
    }), "\n", createVNode(_components.p, {
      children: ["The raw data is remarkably versatile and can be used for countless abstractions because it contains the most granular level of detail possible. A single record has a comprehensive set of fields, including the specific ", createVNode(_components.strong, {
        children: "genetic variant"
      }), ", the ", createVNode(_components.strong, {
        children: "p-value"
      }), " of the association, the ", createVNode(_components.strong, {
        children: "disease or trait"
      }), " it is linked to, the ", createVNode(_components.strong, {
        children: "journal"
      }), " it was published in, and much more. This raw, detailed information is the foundation for all the insights that follow."]
    }), "\n", createVNode(_components.p, {
      children: "However, because it is sourced from so many different studies, the raw data is full of inconsistencies and needs a rigorous quality control check before any analysis. The Bronze layer ensures we have a complete, untouched copy of the raw data before any cleaning begins, which is the first step toward reproducibility."
    }), "\n", createVNode(_components.hr, {}), "\n", createVNode(_components.h3, {
      id: "the-silver-layer-the-first-shine",
      children: "The Silver Layer: The First Shine"
    }), "\n", createVNode(_components.p, {
      children: "The Silver layer is where the real work begins. We take the raw data from the Bronze layer and start the first round of polishing. This is where we apply a rigorous process to clean, validate, and structure the data."
    }), "\n", createVNode(_components.p, {
      children: "For the GWAS Catalog data, this meant:"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Renaming columns:"
        }), " We changed the difficult-to-read column names like ", createVNode(_components.code, {
          children: "DATE ADDED TO CATALOG"
        }), " to something clean and simple, like ", createVNode(_components.code, {
          children: "date_added"
        }), "."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Converting data types:"
        }), " We converted the ", createVNode(_components.code, {
          children: "date_added"
        }), " column from a string to a proper date format, making it usable for time-based analysis."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Filtering out noise:"
        }), " We can filter out any incomplete or low-quality data that could skew our results."]
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: "By the end of this stage, the data is in a clean, structured format, ready for analysis. It’s no longer just a collection of text; it’s a reliable table that can be trusted."
    }), "\n", createVNode(_components.hr, {}), "\n", createVNode(_components.h3, {
      id: "the-gold-layer-the-final-gleam",
      children: "The Gold Layer: The Final Gleam"
    }), "\n", createVNode(_components.p, {
      children: "The Gold layer is the final stage, where the data is polished to perfection and made ready for scientific inquiry. The goal here is to answer specific questions by aggregating the cleaned data. This layer is optimized for analysis and reporting, ensuring that you can get your answers quickly and reliably."
    }), "\n", createVNode(_components.p, {
      children: "The real value here is that we can now use this clean data to get key insights that would have been impossible to see in the raw data. We chose two specific insights to abstract from the data:"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Most Studied Traits:"
        }), " We counted the number of studies for each disease or trait. This gives us a high-level view of where research is most concentrated in the field of genomics."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Most Prolific Journals:"
        }), " We counted the number of studies published in each journal. This tells us which publications are the most influential in this research space."]
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: "The Medallion Architecture isn’t just about moving data; it’s about adding a layer of scientific rigor and trust at every stage, turning a chaotic pile of raw data into a set of reliable, valuable insights."
    }), "\n", createVNode(_components.p, {
      children: "Here’s a sample of what a single record in the raw data looks like:"
    }), "\n", createVNode(_components.pre, {
      class: "astro-code github-dark",
      style: {
        backgroundColor: "#24292e",
        color: "#e1e4e8",
        overflowX: "auto"
      },
      tabindex: "0",
      "data-language": "plaintext",
      children: createVNode(_components.code, {
        children: createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "2016-10-04	26482879	Paternoster L	2015-10-19	Nat Genet	www.ncbi.nlm.nih.gov/pubmed/26482879	Multi-ancestry genome-wide association study of 21,000 cases and 95,000 controls identifies new risk loci for atopic dermatitis.	Atopic dermatitis	18,900 European ancestry cases, 1,472 Japanese ancestry cases, 422 African American cases, 300 Latino cases, 305 cases, 84,166 European ancestry controls, 7,966 Japanese ancestry controls, 844 African American controls, 1,592 Latino controls, 896 controls	 30,588 European ancestry cases, 459 African American cases, 1,012 Chinese ancestry cases, 226,537 European ancestry controls, 729 African American controls, 1,362 Chinese ancestry controls		19p13.2 19		8679458 ADAMTS10, ACTL9 NFILZ					ENSG00000268480					rs2918307-G	rs2918307	0	2918307 3_prime_UTR_variant		0	0.16	5E-12	11.301029995663981	 (EA, fixed effects)	1.12	[1.08–1.16]	Illumina [15539996] (imputed)	N	atopic eczema	http://www.ebi.ac.uk/efo/EFO_0000274	 GCST003184 Genome-wide genotyping array"
          })
        })
      })
    }), "\n", createVNode(_components.p, {
      children: "This single line of text represents a finding from a scientific study, but it’s almost impossible to read. Now, contrast that with the data from the Gold layer. After being “polished” in the Silver layer and aggregated in the Gold layer, the data is now a clean, structured table that is ready for immediate analysis. ."
    }), "\n", createVNode(_components.p, {
      children: "Here’s what the final, polished data looks like, showing the top 10 most-studied traits:"
    }), "\n", createVNode("table", {
      children: [createVNode("thead", {
        children: createVNode("tr", {
          children: [createVNode("th", {
            style: {
              textAlign: "left"
            },
            children: "Trait"
          }), createVNode("th", {
            style: {
              textAlign: "right"
            },
            children: "Study Count"
          })]
        })
      }), createVNode("tbody", {
        children: [createVNode("tr", {
          children: [createVNode("td", {
            children: "body height"
          }), createVNode("td", {
            style: {
              textAlign: "right"
            },
            children: "44,485"
          })]
        }), createVNode("tr", {
          children: [createVNode("td", {
            children: "body mass index"
          }), createVNode("td", {
            style: {
              textAlign: "right"
            },
            children: "21,919"
          })]
        }), createVNode("tr", {
          children: [createVNode("td", {
            children: "fatty acid amount"
          }), createVNode("td", {
            style: {
              textAlign: "right"
            },
            children: "18,779"
          })]
        }), createVNode("tr", {
          children: [createVNode("td", {
            children: "high density lipoprotein cholesterol measurement"
          }), createVNode("td", {
            style: {
              textAlign: "right"
            },
            children: "12,244"
          })]
        }), createVNode("tr", {
          children: [createVNode("td", {
            children: "triglyceride measurement"
          }), createVNode("td", {
            style: {
              textAlign: "right"
            },
            children: "10,532"
          })]
        }), createVNode("tr", {
          children: [createVNode("td", {
            children: "platelet count"
          }), createVNode("td", {
            style: {
              textAlign: "right"
            },
            children: "10,213"
          })]
        }), createVNode("tr", {
          children: [createVNode("td", {
            children: "blood protein amount"
          }), createVNode("td", {
            style: {
              textAlign: "right"
            },
            children: "9,757"
          })]
        }), createVNode("tr", {
          children: [createVNode("td", {
            children: "systolic blood pressure"
          }), createVNode("td", {
            style: {
              textAlign: "right"
            },
            children: "9,574"
          })]
        }), createVNode("tr", {
          children: [createVNode("td", {
            children: "protein measurement"
          }), createVNode("td", {
            style: {
              textAlign: "right"
            },
            children: "9,451"
          })]
        }), createVNode("tr", {
          children: [createVNode("td", {
            children: "erythrocyte volume"
          }), createVNode("td", {
            style: {
              textAlign: "right"
            },
            children: "8,875"
          })]
        })]
      })]
    }), "\n", createVNode("hr", {}), "\n", createVNode(_components.p, {
      children: "…"
    }), "\n", createVNode("hr", {}), "\n", createVNode(_components.p, {
      children: ["You can find all the code for this project on my GitHub repository here: ", createVNode(_components.a, {
        href: "https://github.com/TJAdryan/medallion_project.git",
        children: "https://github.com/TJAdryan/medallion_project.git"
      })]
    }), "\n", createVNode(_components.p, {
      children: "I added the full readme here for people who like to do things the pregit way:"
    }), "\n", createVNode(_components.p, {
      children: "The pipeline processes data through three distinct layers:"
    }), "\n", createVNode(_components.p, {
      children: "Bronze Layer: The raw, ingested data directly from the source."
    }), "\n", createVNode(_components.p, {
      children: "Silver Layer: The cleaned, structured, and validated data."
    }), "\n", createVNode(_components.p, {
      children: "Gold Layer: The aggregated, business-ready data optimized for analysis."
    }), "\n", createVNode(_components.p, {
      children: "The Data: GWAS Catalog\nWe are using data from the GWAS Catalog maintained by the European Bioinformatics Institute (EBI) and the National Human Genome Research Institute (NHGRI). This catalog is a public database of published genome-wide association studies."
    }), "\n", createVNode(_components.p, {
      children: ["Source: ", createVNode(_components.a, {
        href: "https://www.ebi.ac.uk/gwas/api/search/downloads/alternative",
        children: "https://www.ebi.ac.uk/gwas/api/search/downloads/alternative"
      })]
    }), "\n", createVNode(_components.p, {
      children: "Project Setup"
    }), "\n", createVNode(_components.ol, {
      children: ["\n", createVNode(_components.li, {
        children: "Prerequisites\nYou’ll need a Python environment with uv to manage packages."
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: ["Install uv: ", createVNode(_components.a, {
        href: "https://astral.sh/uv/install",
        children: "https://astral.sh/uv/install"
      })]
    }), "\n", createVNode(_components.ol, {
      start: "2",
      children: ["\n", createVNode(_components.li, {
        children: "Environment Setup\nCreate a dedicated virtual environment for the project."
      }), "\n"]
    }), "\n", createVNode(_components.pre, {
      class: "astro-code github-dark",
      style: {
        backgroundColor: "#24292e",
        color: "#e1e4e8",
        overflowX: "auto"
      },
      tabindex: "0",
      "data-language": "plaintext",
      children: createVNode(_components.code, {
        children: [createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "uv venv"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "source .venv/bin/activate"
          })
        })]
      })
    }), "\n", createVNode(_components.ol, {
      start: "3",
      children: ["\n", createVNode(_components.li, {
        children: "Install Dependencies\nWe need a few key libraries for data manipulation and storage."
      }), "\n"]
    }), "\n", createVNode(_components.pre, {
      class: "astro-code github-dark",
      style: {
        backgroundColor: "#24292e",
        color: "#e1e4e8",
        overflowX: "auto"
      },
      tabindex: "0",
      "data-language": "plaintext",
      children: createVNode(_components.code, {
        children: createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {})
        })
      })
    }), "\n", createVNode(_components.p, {
      children: "Project Structure\nThe project is organized to reflect the layers of the Medallion Architecture."
    }), "\n", createVNode(_components.pre, {
      class: "astro-code github-dark",
      style: {
        backgroundColor: "#24292e",
        color: "#e1e4e8",
        overflowX: "auto"
      },
      tabindex: "0",
      "data-language": "plaintext",
      children: createVNode(_components.code, {
        children: [createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "."
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "├── .venv/                         # Virtual environment"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "├── data/"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "│   ├── bronze/                    # Raw, original data"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "│   ├── silver/                    # Cleaned and enriched data"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "│   └── gold/                      # Aggregated and finalized data"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "├── scripts/"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "│   ├── bronze_ingest.py           # Ingestion script"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "│   ├── silver_process.py          # Cleaning and structuring script"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "│   └── gold_transform.py          # Aggregation script"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "├── README.mdx                     # Project documentation"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "└── .gitignore                     # Git ignore file"
          })
        })]
      })
    }), "\n", createVNode(_components.p, {
      children: "The Pipeline Steps\nStep 1: Bronze Layer - Data Ingestion\nThis step downloads the raw GWAS Catalog data. It is the entry point for our data."
    }), "\n", createVNode(_components.p, {
      children: "scripts/bronze_ingest.py"
    }), "\n", createVNode(_components.pre, {
      class: "astro-code github-dark",
      style: {
        backgroundColor: "#24292e",
        color: "#e1e4e8",
        overflowX: "auto"
      },
      tabindex: "0",
      "data-language": "python",
      children: createVNode(_components.code, {
        children: [createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " requests"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " os"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "url "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: ' "https://www.ebi.ac.uk/gwas/api/search/downloads/alternative"'
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "filename "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: ' "gwas_catalog.tsv"'
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "bronze_path "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " os.path.join("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"data"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"bronze"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "os.makedirs(bronze_path, "
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "exist_ok"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "True"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "local_filepath "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " os.path.join(bronze_path, filename)"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "def"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " download_file"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "(url, local_filepath):"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "    if"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " os.path.exists(local_filepath):"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "        print"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "f"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: `"File '`
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "{"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "local_filepath"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "}"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: `' already exists. Skipping download."`
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "        return"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "    print"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "f"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"Downloading '
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "{"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "url"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "}"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: " to "
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "{"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "local_filepath"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "}"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '..."'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "    try"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ":"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        response "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " requests.get(url, "
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "stream"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "True"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        response.raise_for_status()"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "        with"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: " open"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "(local_filepath, "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'wb'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ") "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "as"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " f:"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "            for"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " chunk "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "in"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " response.iter_content("
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "chunk_size"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "8192"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "):"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "                f.write(chunk)"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "        print"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"Download successful!"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "    except"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " requests.exceptions.RequestException "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "as"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " e:"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "        print"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "f"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"Error during download: '
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "{"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "e"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "}"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "if"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: " __name__"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: " =="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: ' "__main__"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ":"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    download_file(url, local_filepath)"
          })
        }), "\n", createVNode(_components.span, {
          class: "line"
        })]
      })
    }), "\n", createVNode(_components.p, {
      children: "Step 2: Silver Layer - Data Processing & Cleaning\nHere, we take the raw data, clean it, and structure it into a more usable format (Parquet)."
    }), "\n", createVNode(_components.p, {
      children: "scripts/silver_process.py"
    }), "\n", createVNode(_components.pre, {
      class: "astro-code github-dark",
      style: {
        backgroundColor: "#24292e",
        color: "#e1e4e8",
        overflowX: "auto"
      },
      tabindex: "0",
      "data-language": "python",
      children: createVNode(_components.code, {
        children: [createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " pandas "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "as"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " pd"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " os"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " pyarrow "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "as"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " pa"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " pyarrow.parquet "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "as"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " pq"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "input_dir "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " os.path.join("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"data"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"bronze"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "output_dir "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " os.path.join("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"data"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"silver"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "os.makedirs(output_dir, "
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "exist_ok"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "True"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "input_file "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " os.path.join(input_dir, "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"gwas_catalog.tsv"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "output_file "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " os.path.join(output_dir, "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"gwas_catalog_clean.parquet"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "def"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " process_gwas_data"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "():"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "    print"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"Reading raw data from the Bronze layer..."'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "    try"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ":"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        gwas_df "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " pd.read_csv(input_file, "
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "sep"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "\\t"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "    except"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: " FileNotFoundError"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ":"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "        print"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "f"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"Error: Raw data file not found at '
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "{"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "input_file"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "}"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: `. Please ensure the file is in the 'data/bronze' directory."`
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "        return"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "    print"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"Cleaning and structuring the data..."'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    cleaned_df "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " gwas_df[["
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "        'DATE ADDED TO CATALOG'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'JOURNAL'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'DISEASE/TRAIT'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'MAPPED_TRAIT'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ","
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "        'SNPS'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'P-VALUE'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'OR or BETA'"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    ]].copy()"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    cleaned_df["
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'DATE ADDED TO CATALOG'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "] "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " pd.to_datetime(cleaned_df["
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'DATE ADDED TO CATALOG'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "])"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    cleaned_df.rename("
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "columns"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "{"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "        'DATE ADDED TO CATALOG'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ": "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'date_added'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'JOURNAL'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ": "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'journal'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ","
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "        'DISEASE/TRAIT'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ": "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'disease'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'MAPPED_TRAIT'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ": "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'mapped_trait'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ","
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "        'SNPS'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ": "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'snps'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'P-VALUE'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ": "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'p_value'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'OR or BETA'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ": "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'or_or_beta'"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    }, "
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "inplace"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "True"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    arrow_table "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " pa.Table.from_pandas(cleaned_df)"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "    print"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "f"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"Writing structured data to the Silver layer at '
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "{"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "output_file"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "}"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '..."'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    pq.write_table(arrow_table, output_file)"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "    print"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"Silver layer processing complete!"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "if"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: " __name__"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: " =="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: ' "__main__"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ":"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    process_gwas_data()"
          })
        }), "\n", createVNode(_components.span, {
          class: "line"
        })]
      })
    }), "\n", createVNode(_components.p, {
      children: "Step 3: Gold Layer - Aggregation & Analysis\nThis is the final stage where we aggregate the clean data into a business-ready format and prepare it for analysis or visualization."
    }), "\n", createVNode(_components.p, {
      children: "scripts/gold_transform.py"
    }), "\n", createVNode(_components.pre, {
      class: "astro-code github-dark",
      style: {
        backgroundColor: "#24292e",
        color: "#e1e4e8",
        overflowX: "auto"
      },
      tabindex: "0",
      "data-language": "python",
      children: createVNode(_components.code, {
        children: [createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " pandas "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "as"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " pd"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " os"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " pyarrow "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "as"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " pa"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " pyarrow.parquet "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "as"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " pq"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "silver_dir "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " os.path.join("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"data"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"silver"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "gold_dir "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " os.path.join("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"data"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"gold"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "os.makedirs(gold_dir, "
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "exist_ok"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "True"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "input_file "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " os.path.join(silver_dir, "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"gwas_catalog_clean.parquet"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "output_journal_file "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " os.path.join(gold_dir, "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"journal_study_counts.parquet"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "output_disease_file "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " os.path.join(gold_dir, "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"disease_study_counts.parquet"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "def"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " aggregate_gwas_data"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "():"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "    print"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"Reading data from the Silver layer..."'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "    try"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ":"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        clean_df "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " pd.read_parquet(input_file)"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "    except"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: " FileNotFoundError"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ":"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "        print"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "f"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"Error: Silver layer file not found at '
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "{"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "input_file"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "}"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '. Please run the silver_process.py script first."'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "        return"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "    print"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"Aggregating study counts by journal..."'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    journal_counts_df "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " clean_df.groupby("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'journal'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ").size().reset_index("
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "name"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'study_count'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    journal_counts_df.sort_values("
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "by"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'study_count'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "ascending"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "False"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "inplace"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "True"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    journal_table "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " pa.Table.from_pandas(journal_counts_df)"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    pq.write_table(journal_table, output_journal_file)"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "    print"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "f"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"Saved journal study counts to '
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "{"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "output_journal_file"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "}"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "    print"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"Aggregating study counts by disease/trait..."'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    disease_counts_df "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " clean_df.groupby("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'mapped_trait'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ").size().reset_index("
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "name"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'study_count'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    disease_counts_df.sort_values("
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "by"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'study_count'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "ascending"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "False"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "inplace"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "True"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    disease_table "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " pa.Table.from_pandas(disease_counts_df)"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    pq.write_table(disease_table, output_disease_file)"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "    print"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "f"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"Saved disease study counts to '
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "{"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "output_disease_file"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "}"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "    print"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"'
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "\\n"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: 'Gold layer processing complete! Final data is ready for analysis."'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "if"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: " __name__"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: " =="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: ' "__main__"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ":"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    aggregate_gwas_data()"
          })
        })]
      })
    }), "\n", createVNode(_components.p, {
      children: "Step 4: Final Analysis & Visualization\nFinally, you can use the Gold layer data to create charts for your blog post."
    }), "\n", createVNode(_components.p, {
      children: "scripts/analyze_gold_data.py"
    }), "\n", createVNode(_components.pre, {
      class: "astro-code github-dark",
      style: {
        backgroundColor: "#24292e",
        color: "#e1e4e8",
        overflowX: "auto"
      },
      tabindex: "0",
      "data-language": "python",
      children: createVNode(_components.code, {
        children: [createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " pandas "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "as"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " pd"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " os"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " matplotlib.pyplot "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "as"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " plt"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "gold_dir "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " os.path.join("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"data"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"gold"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "input_file "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " os.path.join(gold_dir, "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"disease_study_counts.parquet"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "def"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " analyze_and_visualize"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "():"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "    try"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ":"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        gold_df "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " pd.read_parquet(input_file)"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        top_results "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " gold_df.head("
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "10"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "        print"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"'
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "\\n"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: 'Top 10 most studied diseases/traits:"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "        print"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "(top_results.to_string("
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "index"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "False"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "))"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        top_results.plot("
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "kind"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'bar'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "x"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'mapped_trait'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "y"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'study_count'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "legend"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "False"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        plt.title("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'Top 10 Most Studied Diseases/Traits'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        plt.xlabel("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'Disease/Trait'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        plt.ylabel("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "'Study Count'"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        plt.tight_layout()"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        plt.show()"
          })
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "    except"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: " FileNotFoundError"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ":"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "        print"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "f"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '"Error: Gold layer file not found at '
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "{"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "input_file"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "}"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: '. Please run the gold_transform.py script first."'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "        return"
          })
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "if"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: " __name__"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: " =="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: ' "__main__"'
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ":"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    analyze_and_visualize()"
          })
        })]
      })
    })]
  });
}
function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
const url = "src/content/blog/2025-09-29-From-Raw-to-Polished.mdx";
const file = "/Users/dominickryan/astro_blog/astro_blog/src/content/blog/2025-09-29-From-Raw-to-Polished.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment, ...props.components }
});
Content[Symbol.for("mdx-component")] = true;
Content[Symbol.for("astro.needsHeadRendering")] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/dominickryan/astro_blog/astro_blog/src/content/blog/2025-09-29-From-Raw-to-Polished.mdx";
__astro_tag_component__(Content, "astro:jsx");
export {
  Content,
  Content as default,
  file,
  frontmatter,
  getHeadings,
  url
};
