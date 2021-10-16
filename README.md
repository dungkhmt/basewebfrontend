<h1 align="center">Basewebfrontend</h1>

<div align="center">

[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)

</div>

## Installation on Window

Bạn cần có những thứ sau được cài đặt và cấu hình sẵn trước khi bắt đầu cài đặt project: [NodeJS](https://nodejs.org/en/), [Visual Studio Code](https://code.visualstudio.com/). Nếu chưa cài đặt, vui lòng xem hướng dẫn sau:

- [Hướng dẫn cài đặt NodeJS]()

### Tài nguyên

Ở thời điểm hiện tại, các công nghệ sử dụng đã phát hành các phiên bản mới với nhiều bổ sung, nâng cấp. Tuy nhiên, những nâng cấp đó không phải lúc nào cũng đảm bảo được tính
tương thích ngược, dẫn đến việc cài đặt theo hướng dẫn này có thể gặp những lỗi phát sinh không cần thiết. Vì vậy, nên sử dụng các bộ cài đặt được cung cấp ở đây:

- [Installers](https://drive.google.com/drive/folders/1r4VCwCz2JZGg9-LxQFPNw1aTZJl9gYp3?usp=sharing)

Khi đã sẵn sàng cho quá trình cài đặt project, thực hiện lần lượt các bước 1 đến 3:

### 1. Cài đặt project

- Thêm thư mục project <b>basewebfrontend</b> vào Workspace trong Visual Studio Code
- Mở Git Bash tại thư mục project, chạy lệnh: `npm i`

### 2. Chạy project

- Mở Git Bash tại thư mục project (có thể sử dụng Windows Command Prompt, Visual Studio Code Terminal, Windows PowerShell,...), chạy lệnh: `npm start`

Sau lần chạy thành công đầu tiên, ở các lần chạy sau chỉ cần thực hiện bước 2

### 3. Cấu hình Visual Studio Code

Bước này nhằm cài đặt và cấu hình một số extension hữu ích cho trải nghiệm và quá trình phát triển ứng dụng, ví dụ: tiện ích refactor, format code tự động, tiện ích làm việc với Git,... Vì vậy, bước này giữ vai trò cực kì <b>QUAN TRỌNG</b> và là <b>BẮT BUỘC</b> để giữ cho code base chuyên nghiệp, thống nhất xuyên suốt project.

Thực hiện lần lượt theo các bước sau:

- Mở Visual Studio Code (nếu chưa mở)
- Tuỳ chọn sử dụng một trong hai cách sau:

  - Mở Git Bash tại thư mục <b>editor</b>, chạy lệnh: `./vscode-extension-install.bash`

  - Mở Visual Studio Code PowerShell tại thư mục <b>editor</b>, chạy lệnh:

  ```
  Get-Content extensions.txt | ForEach-Object {code --install-extension $_ --force}
  ```

- Trong Visual Studio Code, mở Command Palette bằng shotcut <b>CTRL + SHIFT + P</b>
- Trong Command Palette, nhập vào <b>Open Settings</b> và chọn <b>Open Settings (JSON)</b>
- Thêm các [cấu hình](https://drive.google.com/file/d/1QMVt9ZhpRbvikHA05sTEp4tg9ehwklCt/view?usp=sharing) sau vào file <b>settings.json</b> ở vị trí cuối file, điều này đảm bảo
  ghi đè các cấu hình tương ứng (nếu có) được định nghĩa trước đó

### 4. Một số component

- <b>Tab:</b> src/component/tab
- <b>Button:</b> src/component/button
- <b>Dialog:</b> src/component/dialog

### 5. Tips cấu hình IDEs

- [Tips cấu hình IDEs](https://drive.google.com/file/d/1fKf7MTXCSlk1VpL6iACoHWCvqeE6Ldgc/view?usp=sharing)
