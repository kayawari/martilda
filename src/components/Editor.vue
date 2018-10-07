<template>
  <div class='editor'>
    <h1>Editor Page</h1>
    <span>{{user.displayName}}</span>
    <div>
      <button @click="logout">logout</button>
    </div>
    <div class="memoListWrapper">
      <div class="memoList" v-for="(memo, index) in memos" @click="selectMemo(index)" v-bind:data-selected="index == selectedIndex">
        <p class="memoTitle">{{displayTitle(memo.markdown)}}</p>
      </div>
      <button class="addMemoBtn" @click="addMemo">メモ追加</button>
      <button class="deleteMemoBtn" v-if="memos.length > 1" @click="deleteMemo">削除</button>
      <button class="saveMemosBtn" @click="saveMemos">保存</button>
    </div>
    <div class="editorWrapper">
      <textarea class="markdown" v-model="memos[selectedIndex].markdown"></textarea>
      <div class="preview" v-html="preview()"></div>
    </div>
  </div>
</template>

<script>
import marked from 'marked';

export default {
  name: 'editor',
  props: ['user'],
  data () {
    return {
      markdown: '',
      memos: [{
        markdown: ''
      }],
      selectedIndex: 0,
    }
  },
  methods: {
    logout: function(){
      firebase.auth().signOut();
    },
    preview: function(){
      return marked(this.memos[this.selectedIndex].markdown);
    },
    addMemo: function(){
      this.memos.push({
        markdown: '無題メモ',
      })
    },
    saveMemos: function(){
      firebase
        .database()
        .ref('memos/' + this.user.uid)
        .set(this.memos);
    },
    deleteMemo: function(){
      firebase
        .database()
        .ref('memos/' + this.user.uid + '/' + this.selectedIndex)
        .remove();
      this.memos.splice(this.selectedIndex, 1);
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
    },
    selectMemo: function(index){
      this.selectedIndex = index;
    },
    displayTitle: function(text){
      return text.split(/\n/)[0];
    },
  },
  created: function(){
    firebase
      .database()
      .ref('memos/' + this.user.uid)
      .once('value')
      .then(result => {
        if(result.val()) {
          this.memos = result.val();
        }
      })
  }
}
</script>

<style lang='scss'>
.memoListWrapper {
  width: 19%;
  float: left;
  border-top: 1px solid #000;
}
.memoList {
  padding: 10px;
  box-sizing: border-box;
  text-align: left;
  border-bottom: 1px solid #000;

  &:nth-child(even) {
    background-color: #ccc;
  }

  &[data-selected="true"] {
    background-color: #ccf;
  }
}
.memoTitle {
  height: 1.5em;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
}
.addMemoBtn {
  margin-top: 20px;
}
.deleteMemoBtn{
  margin: 10px;
}
.editorWrapper{
  display: flex;
}
.markdown {
  width: 50%;
  height: 500px;
}
.preview {
  width: 50%;
  text-align: left;
}
</style>
