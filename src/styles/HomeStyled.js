import styled from 'styled-components'

export const Container = styled.View`
    flex: 1;
    width: 100%;
    background-color: ${props => props.bgColor || 'transparent'};
`

export const Post = styled.View`
    padding: 10px;
`

export const PostWrapper = styled.View`
    background-color: #f8f8f8;
    border-radius: 8px;
    margin: 10px 0;
`

export const Avatar = styled.Image`
    width: 40px;
    height: 40px;
    border-radius: 40px;
    margin-right: 10px;
`

export const PostText = styled.View`
    margin: 10px 0;
`

export const PostInteract = styled.View`
    padding: 20px;
    flex-direction: row;
    border-top-width: 0.5px;
    border-color: rgba(0, 0, 0, 0.2);
`

export const InteractText = styled.Text`
    color: #3c5898;
    font-weight: 700;
    margin-left: 5px;
`

export const AddPostContainer = styled(Container)`
    padding: 20px;
`

export const AddPostInput = styled.TextInput`
    flex: 1;
    width: 100%;
    font-size: 20px;
`

export const AddPostHeader = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

export const AddPostHeaderLoading = styled.View`
    justify-content: center;
    align-items: center;
    flex-direction: row
`