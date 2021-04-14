<template>
    <div class="info">
        <div class="basic">
            <img :src="photo.path" />
            <p><strong>Title: </strong>{{photo.title}}</p>
            <p><strong>Name: </strong> {{photo.user.firstName}} {{photo.user.lastName}}</p>
            <p><strong>Description: </strong>{{photo.description}}</p>
            <p><strong>Date: </strong>{{formatDate(photo.created)}}</p>
        </div>
        <div class="form-wrapper">
            <div v-if="this.$root.$data.user != null" class="form">
                <h3>Comment: </h3>
                <form v-on:submit.prevent="addComment()">
                    <textarea rows="4" cols="50"  v-model="eDescription" placeholder="Description"></textarea><br/><br/>
                    <button type="submit">Comment</button>
                </form>
                <br/>
            </div>
            <div class="list">
                <h3>List of Comments:</h3>
                <div v-for="comment in allcom" v-bind:key="comment._id">
                    <p>{{comment.comment}}</p>
                    <p>--<i>{{comment.user.firstName}} {{comment.user.lastName}}</i></p>
                    <p><strong>Date: </strong>{{formatDate(comment.created)}}</p>
                    <br/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
export default {
  name: 'Singlepic',
  data() {
    return {
        photo: {
            user: {firstName: '', lastName: ''},
            description: '',
            create: ''
        },
        error: '',
        eDescription: '',
        allcom: [],
    }
  },
  created() {
    this.getPhoto();
    this.getComments(); 
  },
  methods: {
    async getPhoto() {
      try {
        let response = await axios.get("/api/photos/" + this.$route.params.id);
        this.photo = response.data;
        console.log(this.photo);
      } catch (error) {
          console.log(this.photo);
        this.error = error.response.data.message;
      }
    },
    async getComments() {
      try {
        let response = await axios.get("/api/comments/" + this.$route.params.id );
        this.comments = response.data;
        this.allcom = [];
        let getcomments = await axios.get("/api/comments/" + this.$route.params.id );
        this.allcom = getcomments.data;
        console.log(getcomments);
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async addComment() {
      try {
        await axios.post("/api/comments/" + this.$route.params.id , {
            comment: this.eDescription
        });
        this.eDescription = "";
        this.getComments();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    formatDate(date) {
      if (moment(date).diff(Date.now(), 'days') < 15)
        return moment(date).fromNow();
      else
        return moment(date).format('d MMMM YYYY');
    }
  }
}
</script>

<style scoped>
    img {
    margin-top: 150px;
    padding: 5px;
    width: 500px;
    }
    
    .info {
        display: flex;
        justify-content: space-around;
    }

    .form{
        margin-left: 100px;
        margin-top: 150px;
    }

    .form-wrapper {
        display: flex;
        flex-direction: column;
    }

    .list {
        margin-top: 70px;
        margin-left:100px;
    }
</style>