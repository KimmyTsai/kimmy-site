---
slug: java-toolkit
title: Java 程式設計作品
summary: 大二那年的 Java 產出——TF-IDF 搜尋引擎、股價爬蟲與分析工具、Mermaid 類圖轉程式碼，以及一款卡牌遊戲。
order: 6
period: '2024'
role: 個人／小組
stack: [Java, jsoup, OOP]
draft: false
---

2024 年程式設計課的一系列作品。現在回頭看，這批東西的共同點是**都在處理「把一種格式變成另一種格式」**——文件變索引、HTML 變數據、類圖變程式碼。當時沒有意識到，但這確實是後來一直在做的事情。

## TF-IDF 搜尋引擎

實作一個簡單的搜尋引擎，用 TF-IDF（詞頻—逆文件頻率）計算關鍵字權重，做搜尋與排序。分成兩支程式：`BuildIndex.java` 建立索引並序列化保存，`TFIDFSearch.java` 讀索引、處理查詢。

把索引建立與查詢拆成兩個階段是這個作業最有價值的地方——它是「預先算好」這個想法的第一次具體實作。

→ [Search-with-TF-IDF](https://github.com/KimmyTsai/Search-with-TF-IDF)

## 股價爬蟲與分析工具

用 `jsoup` 從網站抓股價，存進 CSV，再對累積的資料做分析：5 日移動平均、標準差、找出指定期間標準差最大的前三名股票、以及回歸直線。

爬蟲跟分析做成同一支程式的兩個模式（`mode 0` 爬、`mode 1` 分析），資料落地在 CSV 當作兩者之間的介面。

→ [Powerful-Toolkit-in-Java-Using-HTML-Parser-to-Crawl-Internet-Data](https://github.com/KimmyTsai/Powerful-Toolkit-in-Java-Using-HTML-Parser-to-Crawl-Internet-Data)

## Mermaid 類圖轉 Java 程式碼

輸入一段 Mermaid 的 `classDiagram` 語法，輸出對應的 Java 類別——屬性、方法簽章、存取修飾子都自動生出來。

寫這個等於是自己做了一次小型的 parser，也是第一次認真面對「語法」跟「語意」是兩件事。

→ [Code-Generator-for-Mermaid-Class-Diagram](https://github.com/KimmyTsai/Code-Generator-for-Mermaid-Class-Diagram)

## 卡牌冒險遊戲

程式設計二的期末專題，向《Slay the Spire》致敬的卡牌遊戲：自組牌組、冒險模式、卡牌組合技。

這是整批裡程式碼量最大的一個，也是第一次體會到**物件導向不是為了考試存在的**——當敵人、卡牌、狀態效果各有十幾種變化時，繼承與多型突然從抽象的名詞變成唯一能讓程式不崩潰的東西。

→ [Slay-the-Spire-Java-game](https://github.com/KimmyTsai/Slay-the-Spire-Java-game)
