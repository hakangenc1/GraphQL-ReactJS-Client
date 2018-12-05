import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { getBooksQuery, deleteBookMutation } from '../queries/queries'
import BookDetails from './BookDetails'
import {
    Skeleton, 
    Card, 
    Button,
    Avatar,
    Row,
    Col,
    Alert,
    Spin,
    Modal
} from 'antd';



const { Meta } = Card;
class BookList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: null
        }
    }
    confirm = (id) => {
        Modal.confirm({
          title: 'Warning!',
          onOk: () => this.deleteBook(id),
          content: 'Do you want to delete the book',
          okText: 'Yes',
          cancelText: 'No',
        });
      }
    deleteBook(id) {
        if(id) {
            this.props.deleteBookMutation({
                variables: {
                    id: id
                },
                refetchQueries: [
                    {
                        query: getBooksQuery
                    }
                ]
            });
            this.setState({
                selected: null
            })
        }
    }
    displayBooks = () => {
        const data = this.props.getBooksQuery;
        if(data.loading) {
            return(
                <div style={{marginTop: '15px'}}>
                    <Spin />
                </div>
            )
        } else if(data.books.length === 0){
            return(
                <Alert style={{width:'10%', margin: 'auto', marginTop: '15px'}}
                    message="Info"
                    description="No added books"
                    type="error"
                />
            )
        }
        else {
            return data.books.map(book => {                
                return (
                        <Col span={8} key={book.id} style={{marginTop: '15px'}}>
                            <Card
                                style={{ width: 500, marginTop: 16, margin: 'auto' }}
                                actions={[<Button icon="book" type="primary" onClick={(e) => this.setState({ selected: book.id })} >Show Detail</Button>]}
                                >
                                <Button type="danger" icon="close" size="small" shape="circle" style={{position: 'absolute', right: '5px', top:'5px'}} onClick={ () => this.confirm(book.id) } />
                                <Skeleton loading={false} avatar active>
                                        <Meta
                                        avatar={<Avatar src="https://cdn4.iconfinder.com/data/icons/basic-17/80/22_BO_open_book-512.png" />}
                                        title={'Book: ' + book.name}
                                        description={book.author.name + ' ' + book.author.age} 
                                        />
                                </Skeleton>
                            </Card>
                        </Col>
                )
            })
        }
    }
    
    render() {
        return (
            <div>
                <Row gutter={16}>
                    {
                            this.displayBooks()
                    }
                </Row>
                <BookDetails bookId={this.state.selected} />
            </div>
        )
    }
}

export default compose(
    graphql(getBooksQuery, { name: 'getBooksQuery' }),
    graphql(deleteBookMutation, { name: 'deleteBookMutation' })
)(BookList)