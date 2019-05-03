<template>
  <div class='editor'>
    <Alert v-show="alert" @closeAlert="closeAlert">
      <p>メモを削除しました</p>
    </Alert>
    <Notice v-show="notice" @closeNotice="closeNotice">
      <p>メモを保存しました</p>
    </Notice>

    <b-form-group>
      <b-form inline>
        <label class="sr-only" for="inline-form-input-search-word">検索</label>
        <b-input
          id="inline-form-input-search-word"
          class="mb-2 mr-sm-2 mb-sm-0"
          v-model="searchText"
          placeholder="Enter search word"
        ></b-input>

        <label class="sr-only" for="inline-form-input-categories">Categories</label>
        <b-input id="inline-form-input-categories" v-model="memos[selectedIndex].categories" placeholder="Enter categories separated by commas"></b-input>
      </b-form>
    </b-form-group>

    <div class="memoListWrapper">
      <transition-group name="memoList" tag="div">
        <div class="memoList" v-for="(memo, index) in memos" v-bind:key="`memoList-${index}`" v-on:click="selectMemo(index)" v-bind:data-selected="index == selectedIndex">
          <span class="memoTitle">{{displayTitle(memo.markdown)}}</span>
          <small class="memoUpdatedAt"><label>updated at:</label>{{memos[selectedIndex]._updatedAt | dateFormatter}}</small>
          <small class="memoCreatedAt"><label>createed at:</label>{{memos[selectedIndex]._createdAt | dateFormatter}}</small>
        </div>
      </transition-group>
      <div class="memoButtonGroup">
        <b-button variant="primary" class="addMemoBtn" v-on:click="addMemo">メモ追加</b-button>
        <b-button variant="light" class="saveMemosBtn" v-on:click="saveMemos">保存</b-button>
        <b-button variant="danger" class="deleteMemoBtn" v-if="memos.length > 1" v-on:click="openModal">削除</b-button>
      </div>
      <Modal @close="closeModal" v-if="modal">
        <p>メモを削除します</p>
        <template slot="footer">
          <button v-on:click="deleteMemo">削除</button>
        </template>
      </Modal>
    </div>

    <div class="editorWrapper">
      <transition name="editor" tag="div">
        <textarea class="markdown"
                  v-on:keyup.ctrl.83="saveMemos"
                  v-on:keydown.tab.prevent="inputTab($event)"
                  v-on:input="countAnySecondToSave"
                  v-if="memos.length > 1"
                  v-model="memos[selectedIndex].markdown"></textarea>
      </transition>
      <div class="preview" v-html="preview()"></div>
    </div>
  </div>
</template>

<script>
import marked from 'marked'
import _ from 'lodash'
import highlightjs from 'highlight.js'
import Modal from './Modal.vue'
import Alert from './flash_messages/Alert.vue'
import Notice from './flash_messages/Notice.vue'
import format from 'date-fns/format'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

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
      return format(date, 'YYYY/MM/DD')
    }
  },
  watch: {
    searchText: _.debounce(function (newText, _oldText) {
      this.filterMemos(newText)
    }, 1000)
  },
  methods: {
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
        _createdAt: new Date().toString(),
        categories: ''
      })

      firebase
        .database()
        .ref('memos/' + this.user.uid)
        .set(this.memos)
    },
    saveMemos: function () {
      var memo = this.memos[this.selectedIndex]
      firebase
        .database()
        .ref('memos/' + this.user.uid + '/' + this.selectedIndex)
        .set({
          markdown: memo.markdown,
          _updatedAt: new Date().toString(),
          _createdAt: memo._createdAt,
          categories: this.memos[this.selectedIndex].categories
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
    },
    inputTab: function (e) {
      /* NOTE: textarea内での複数行インデントを可能にしています */
      /* ref: https://qiita.com/laineus/items/12a220d2ab086931232d */
      e.preventDefault()
      const TAB_STR = '  '
      const selectArea = { start: e.target.selectionStart, end: e.target.selectionEnd }
      const lineStart = e.target.value.substr(0, selectArea.start).split('\n').length - 1
      const lineEnd = e.target.value.substr(0, selectArea.end).split('\n').length - 1
      const lines = e.target.value.split('\n')
      for (const i in lines) {
        if (i < lineStart || i > lineEnd || lines[i] === '') continue
        if (!e.shiftKey) {
          selectArea.start += i === lineStart ? TAB_STR.length : 0
          lines[i] = TAB_STR + lines[i]
          selectArea.end += TAB_STR.length
        } else if (lines[i].substr(0, TAB_STR.length) === TAB_STR) {
          selectArea.start -= i === lineStart ? TAB_STR.length : 0
          lines[i] = lines[i].substr(TAB_STR.length)
          selectArea.end -= TAB_STR.length
        }
      }
      e.target.value = lines.join('\n')
      e.target.setSelectionRange(selectArea.start, selectArea.end)
      return true
    }
  },
  created: function () {
    firebase
      .database()
      .ref('memos/' + this.user.uid)
      .once('value')
      .then(result => {
        if (result.val()) { this.memos = result.val() }
      })

    marked.setOptions({
      langPrefix: '',
      highlight: function (code, lang) {
        return highlightjs.highlightAuto(code, [lang]).value
      }
    })
  }
}
</script>

<style lang='scss' scoped>
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
.memoButtonGroup {
  margin-top: 10px;
}
.memoTitle {
  height: 1.5em;
  display: block;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
}
.memoUpdatedAt, .memoCreatedAt {
  display: inline-block;
  line-height: 0.3em;
  font-size: xx-small;
  color: #888888;
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
.markdown, .preview {
  width: 50%;
  height: 500px;
  padding: 4px;
}
.preview {
  text-align: left;
  overflow: auto;
  border: 1px solid gray;
}
</style>
