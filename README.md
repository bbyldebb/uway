# uway

## Git使用规范
- 开发时请根据issue，从主分支上创建一个新分支，同时在issue中评论`/estimate [预计花费的时间]`。完成issue后在issue中评论`/spend [实际花费的时间]`，然后发起merge request，merge request标题最后加上`Ref #issueId`，merge request的描述中加上`Closes #issueId`以及`/spend [实际花费的时间]`，还有必要的描述。

- 分支上第一次commit时，在commit message最后加上`Closes #issueId`，注意`Closes`前留个空格，之后commit的时候，在commit message后加上`Ref #issueId`，注意Ref与前面也要空格。

- 注意commit的频率，不要一次commit修改好几个功能，也不要修改一两行就commit一次，commit message使用英文，必须是完整句，描述清晰。最好是完成一个部分或者功能时commit一次。

- 提交的代码必须是格式化的代码，符合代码规范的代码。
