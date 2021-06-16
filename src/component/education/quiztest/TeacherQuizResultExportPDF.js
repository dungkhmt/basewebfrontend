import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function header(testId) {
  return [
    {
      text: "Kết quả test " + testId,
      bold: true,
      fontSize: 16,
      alignment: "center",
      margin: [0, 0, 0, 20],
    },
  ];
}

function resultDetailList(dataPdf) {
  let contentResult = [];

  dataPdf.map((value, index) => {
    let studentResult = [];
    let info = {
      text:
        "Họ và tên: " +
        value.fullName +
        "\n" +
        "Điểm: " +
        value.totalGrade +
        "\n Nhóm: " +
        value.groupId +
        "\n Chi tiết bài làm:",
      fontSize: 17,
      width: "auto",
      margin: [0, 3, 5, 5],
    };
    let line = {
      text: "-----------------------------------------------------------------------------------------------------------------------------------------------------------",
      margin: [0, 15, 0, 0],
      width: "auto",
    };
    studentResult.push(line);
    studentResult.push(info);
    value["listQuestion"].map((ques, indexques) => {
      let questionDetail = [];
      let quesNumber = {
        text: "Câu " + (indexques + 1).toString(),
        style: "itemQuestion",
      };
      let quesContent = htmlToPdfmake(ques["content"], {
        defaultStyles: {
          b: { bold: true, fontSize: 16 },
          strong: { bold: true, fontSize: 16 },
          u: { decoration: "underline", fontSize: 16, bold: true },
          s: { decoration: "lineThrough", bold: true, fontSize: 16 },
          em: { italics: true, bold: true, fontSize: 16 },
          i: { italics: true, bold: true },
          h1: { fontSize: 24, bold: true, marginBottom: 5 },
          h2: { fontSize: 22, bold: true, marginBottom: 5 },
          h3: { fontSize: 20, bold: true, marginBottom: 5 },
          h4: { fontSize: 18, bold: true, marginBottom: 5 },
          h5: { fontSize: 16, bold: true, marginBottom: 5 },
          h6: { fontSize: 14, bold: true, marginBottom: 5 },
          a: {
            color: "blue",
            decoration: "underline",
            bold: true,
            fontSize: 16,
          },
          strike: { decoration: "lineThrough", bold: true, fontSize: 16 },
          p: { margin: [0, 5, 0, 10], bold: true, fontSize: 16 },
          ul: { marginBottom: 5, bold: true, fontSize: 16 },
          li: { marginLeft: 5, bold: true, fontSize: 16 },
          table: { marginBottom: 5, bold: true, fontSize: 16 },
          th: { bold: true, fillColor: "#EEEEEE", bold: true, fontSize: 16 },
        },
      });
      console.log(quesContent);
      questionDetail.push(quesNumber);
      questionDetail.push(quesContent);
      ques["listAnswer"].map((ans, indAns) => {
        let isChoose = ques.listchooseAns.includes(ans.choiceAnswerId)
          ? true
          : false;
        if (!isChoose) {
          console.log(value.fullName + "  " + ans.choiceAnswerContent);
        }
        let pele =
          ans.isCorrectAnswer === "Y"
            ? {
                margin: [0, 5, 0, 10],
                bold: isChoose,
                decoration: "underline",
              }
            : {
                margin: [0, 5, 0, 10],
                bold: isChoose,
              };
        let ansTmp = htmlToPdfmake(ans.choiceAnswerContent, {
          defaultStyles: {
            b: { bold: true },
            strong: { bold: true },
            u: { decoration: "underline" },
            s: { decoration: "lineThrough" },
            em: { italics: true },
            i: { italics: true },
            h1: { fontSize: 24, bold: true, marginBottom: 5 },
            h2: { fontSize: 22, bold: true, marginBottom: 5 },
            h3: { fontSize: 20, bold: true, marginBottom: 5 },
            h4: { fontSize: 18, bold: true, marginBottom: 5 },
            h5: { fontSize: 16, bold: true, marginBottom: 5 },
            h6: { fontSize: 14, bold: true, marginBottom: 5 },
            a: { color: "blue", decoration: "underline" },
            strike: { decoration: "lineThrough" },
            p: pele,
            ul: { marginBottom: 5 },
            li: { marginLeft: 5 },
            table: { marginBottom: 5 },
            th: { bold: true, fillColor: "#EEEEEE" },
          },
        });
        console.log(ansTmp);
        questionDetail.push(ansTmp);
      });
      let quesGrade = {
        text: "Điểm : " + ques["grade"],
        style: "itemGrade",
      };
      questionDetail.push(quesGrade);
      studentResult.push(questionDetail);
    });

    contentResult.push(studentResult);
  });

  return contentResult;
  // {
  //   content: [
  //     [
  //          {
  //              text: "\n Họ và tên: "+{}+  "Điểm: "+ 3 +"\n Nhóm"+ 1+"\n Chi tiết bài làm:",
  //              fontSize: 18,
  //              width: 'auto',
  //          },
  //           {
  //              text:'-----------------------------------------------------------------------------------------------------------------------------------------------------------',
  //              margin: [0, 5, 0, 5],
  //              width: 'auto',
  //          },
  //         [
  //            [
  //                {
  //                    text: "Câu 1. Đệ quy có nhớ có cần sử dụng  bộ nhớ ko?",
  //                    style: 'itemQuestion'
  //                },
  //                {
  //                    text: "Có",
  //                    style: 'itemchoose'
  //                },
  //                {
  //                    text: "Không",
  //                    style: 'itemText'
  //                },
  //                {
  //                    text: "Điểm : 15",
  //                    style: 'itemGrade'
  //                }
  //            ],
  //            [
  //                {
  //                    text: "Câu 2. Đệ quy có nhớ có cần sử dụng  bộ nhớ ko?",
  //                    style: 'itemQuestion'
  //                },
  //                {
  //                    text: "Có",
  //                    style: 'itemtext'
  //                },
  //                {
  //                    text: "Không",
  //                    style: 'itemchoose'
  //                },
  //                {
  //                    text: "Điểm : 15",
  //                    style: 'itemGrade'
  //                }
  //            ]

  //         ],
  //     ],
  //     '\n\n',
  //   ]
  // }
}
function resultList(students) {
  return {
    columns: [
      { width: "*", text: "" },
      {
        width: "auto",
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: ["auto", "auto", "auto"],
          body: [
            // Table Header
            [
              {
                text: "Họ và tên",
                style: ["itemsHeader", "center"],
              },
              {
                text: "Nhóm",
                style: ["itemsHeader", "center"],
              },
              {
                text: "Điểm",
                style: ["itemsHeader", "center"],
              },
            ],
            // Items
            // Item 1
            ...students.map((student) => [
              {
                text: student.fullName,
                style: "itemText",
              },
              {
                text: student.groupId,
                style: "itemText",
              },
              {
                text: student.grade.toString(),
                style: "itemText",
              },
            ]),
          ],
        },
      },
      { width: "*", text: "" },
    ],
  };
}

let styles = {
  // Items Header
  itemsHeader: {
    margin: [0, 5, 0, 5],
    bold: true,
    alignment: "center",
  },
  itemNumber: {
    margin: [0, 5, 0, 5],
    alignment: "center",
  },
  itemText: {
    margin: [0, 5, 0, 5],
    alignment: "center",
  },
  itemAns: {
    margin: [0, 5, 0, 5],
    alignment: "left",
  },
  center: {
    alignment: "center",
  },
  itemQuestion: {
    margin: [0, 5, 0, 5],
    bold: true,
    fontSize: 16,
    alignment: "left",
  },
  itemGrade: {
    margin: [0, 5, 0, 5],
    italics: true,
    alignment: "left",
  },
};

export function exportResultListPdf(
  studentListResult,
  resultExportPDFData,
  testId
) {
  console.log(studentListResult);
  studentListResult.sort(function (firstEl, secondEl) {
    if (firstEl.fullName === null || secondEl.fullName === null) return -1;
    if (firstEl.fullName.toLowerCase() < secondEl.fullName.toLowerCase()) {
      return -1;
    }
    if (firstEl.fullName.toLowerCase() > secondEl.fullName.toLowerCase()) {
      return 1;
    }
    return 0;
  });
  let resultData = [];
  studentListResult.map((student, index) => {
    let tmp = {};
    tmp.fullName = student.fullName;
    tmp.groupId = student.groupId;
    tmp.grade = student.grade;
    resultData.push(tmp);
  });
  let dataDetail = resultDetailList(resultExportPDFData);
  console.log(dataDetail);
  const docDefinitions = {
    // a string or { width: number, height: number }
    pageSize: "A4",

    // by default we use portrait, you can change it to landscape if you wish
    pageOrientation: "portrait",
    // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
    pageMargins: [40, 20, 20, 40],
    footer: function (currentPage, pageCount) {
      return [
        {
          text: "Page " + currentPage.toString() + " of " + pageCount,
          alignment: "center",
        },
      ];
    },
    // header: function(currentPage, pageCount, pageSize) {
    //     // you can apply any logic and return any valid pdfmake element
    //     return [
    //     { text: 'simple text', alignment: (currentPage % 2) ? 'left' : 'right' },
    //     { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
    //     ]
    // },
    content: [
      ...header(testId),

      "\n\n",
      resultList(resultData),
      "\n\n",
      dataDetail,
    ],
    styles: styles,
    defaultStyle: {
      columnGap: 20,
    },
  };
  pdfMake
    .createPdf(docDefinitions)
    .download("Danh sách kết quả test  " + testId + ".pdf");
}
