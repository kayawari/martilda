<template>
  <div class='editor'>
    <h1>Editor Page</h1>
    <span>{{user.displayName}}</span>
    <div>
      <button v-on:click="logout">logout</button>
    </div>
    <Alert v-show="alert" @closeAlert="closeAlert">
      <p>メモを削除しました</p>
    </Alert>
    <Notice v-show="notice" @closeNotice="closeNotice">
      <p>メモを保存しました</p>
    </Notice>
    <div>
      <input type="text" v-model="searchText">
    </div>
    <div class="memoListWrapper">
      <transition-group name="memoList" tag="div">
        <div class="memoList" v-for="(memo, index) in memos" v-bind:key="`memoList-${index}`" v-on:click="selectMemo(index)" v-bind:data-selected="index == selectedIndex">
          <p class="memoTitle">{{displayTitle(memo.markdown)}}</p>
        </div>
      </transition-group>
      <button class="addMemoBtn" v-on:click="addMemo">メモ追加</button>
      <button class="deleteMemoBtn" v-if="memos.length > 1" v-on:click="openModal">削除</button>
      <Modal @close="closeModal" v-if="modal">
        <p>メモを削除します</p>
        <template slot="footer">
          <button v-on:click="deleteMemo">削除</button>
        </template>
      </Modal>
      <button class="saveMemosBtn" v-on:click="saveMemos">保存</button>
    </div>
    <input type="text" class="categories" v-model="memos[selectedIndex].categories">
    <div class="editorWrapper">
      <transition name="editor" tag="div">
        <textarea class="markdown" v-on:keyup.ctrl.83="saveMemos" v-on:input="countAnySecondToSave" v-if="memos.length > 1" v-model="memos[selectedIndex].markdown"></textarea>
      </transition>
      <div class="preview" v-html="preview()"></div>
      <small>{{memos[selectedIndex]._updatedAt | dateFormatter}}</small>
      <small>{{memos[selectedIndex]._createdAt | dateFormatter}}</small>
    </div>
  </div>
</template>

<script>
import marked from 'marked'
import _ from 'lodash'
import Modal from './Modal.vue'
import Alert from './flash_messages/Alert.vue'
import Notice from './flash_messages/Notice.vue'
import firebase from 'firebase'
import format from 'date-fns/format'

export default {
  name: 'editor',
  components: {
    'Modal': Modal,
    'Alert': Alert,
    'Notice': Notice
  },
  props: ['user'],
  data () {
    return {
      searchText: '',
      markdown: '',
      memos: [{
        markdown: '',
        categories: '',
        _updatedAt: '',
        _createdAt: ''
      }],
      selectedIndex: 0,
      modal: false,
      alert: false,
      notice: false,
      timer: null
    }
  },
  filters: {
    dateFormatter: function (date) {
      return format(new Date(), 'YYYY/MM/DD')
    }
  },
  watch: {
    searchText: _.debounce(function (newText, _oldText) {
      this.filterMemos(newText)
    }, 1000)
  },
  methods: {
    logout: function () {
      firebase.auth().signOut()
    },
    preview: function () {
      return marked(this.memos[this.selectedIndex].markdown)
    },
    countAnySecondToSave: function () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(this.saveMemos, 3000)
    },
    addMemo: function () {
      this.memos.push({
        markdown: '無題メモ',
        _updatedAt: new Date().toString(),
        _createdAt: new Date().toString()
      })

      firebase
        .database()
        .ref('memos/' + this.user.uid)
        .set(this.memos)
    },
    saveMemos: function () {
      var memo = this.memos[this.selectedIndex]

      var categoriesList = this.memos[this.selectedIndex].categories.split(',')
      var categoriesHash = {}
      categoriesList.map(category => { categoriesHash[category] = true })
      // TODO: categoriesテーブルにも更新処理が入るようにする
      firebase
        .database()
        .ref('memos/' + this.user.uid + '/' + this.selectedIndex)
        .set({
          markdown: memo.markdown,
          _updatedAt: new Date().toString(),
          _createdAt: memo._createdAt,
          categories: categoriesHash
        })
      this.notice = true
      setTimeout(this.closeNotice, 3000)
    },
    deleteMemo: function () {
      firebase
        .database()
        .ref('memos/' + this.user.uid + '/' + this.selectedIndex)
        .remove()

      this.memos.splice(this.selectedIndex, 1)
      if (this.selectedIndex > 0) {
        this.selectedIndex--
      }

      // TODO: メモが増えてきたら、都度すべてのデータを更新するはキツイ
      // メモを削除したあと、keyを貼り直さないとv-for: indexでリスト表示しているので、連番でないとエラーになる
      firebase
        .database()
        .ref('memos/' + this.user.uid)
        .set(this.memos)

      this.modal = false
      this.alert = true
      setTimeout(this.closeAlert, 3000)
    },
    selectMemo: function (index) {
      this.selectedIndex = index

      if (this.memos[this.selectedIndex]._updatedAt === undefined || this.memos[this.selectedIndex]._createdAt === undefined) {
        this.memos[this.selectedIndex]._updatedAt = new Date().toString()
        this.memos[this.selectedIndex]._createdAt = new Date().toString()
      }
    },
    displayTitle: function (text) {
      return text.split(/\n/)[0]
    },
    openModal: function () {
      this.modal = true
    },
    closeModal: function () {
      this.modal = false
    },
    closeAlert: function () {
      this.alert = false
    },
    closeNotice: function () {
      this.notice = false
    },
    filterMemos: function (newText) {
      var allMemos = {}

      firebase
        .database()
        .ref('memos/' + this.user.uid)
        .once('value')
        .then(result => {
          if (result.val()) {
            allMemos = result.val()
            this.memos = _.filter(allMemos, function (memo) {
              return _.includes(memo.markdown.toLowerCase(), newText.toLowerCase())
            })
          }
        })
    }
  },
  created: function () {
    firebase
      .database()
      .ref('memos/' + this.user.uid)
      .once('value')
      .then(result => {
        if (result.val()) {
          this.memos = result.val()
          result.val().forEach((v, i) => { this.memos[i].categories = Object.keys(v.categories).join(',') })
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
  padding: 5px;
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
.memoList-enter-active, .memoList-leave-active {
  transition: opacity 0.4s;
}
.memoList-leave-active {
  transition: opacity 0.4s ease 0.4s;
}
.memoList-enter, .memoList-leave_to {
  opacity: 0;
  transform: translateY(30px);
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
.editor-enter {
  opacity: 0;
  transform: translateY(30px);
}
.editor-enter-active {
  transition: opacity 0.4s;
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
