import { Upload } from 'antd'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ApiManager from '../../api/ApiManager'
import { emitRootKeyChanged } from '../../redux/actions/GlobalActions'
import StorageHelper from '../../utils/StorageHelper'
let authToken = StorageHelper.getAuthKeyFromStorage() || ''

// function getBase64(img, callback) {
//     console.log('starting...')
//     const reader = new FileReader()
//     console.log(reader, 'reader')
//     reader.addEventListener('load', () => callback(reader.result))
//     console.log(img, 'img')
//     reader.readAsDataURL(img)
//     console.log('done')
// }

// function beforeUpload(file) {
//     const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
//     if (!isJpgOrPng) {
//         message.error('You can only upload JPG/PNG file!')
//     }
//     const isLt2M = file.size / 1024 / 1024 < 2
//     if (!isLt2M) {
//         message.error('Image must smaller than 2MB!')
//         console.log('select smaller image')
//     }
//     return isJpgOrPng && isLt2M
// }

class UploadAvatar extends Component<any, any> {
    state = {
        loading: false,
    }

    handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true })
            return
        }
        if (info.file.status === 'done') {
            this.props.emitRootKeyChanged()
            //    this.setState({})
            // Get this url from response in real world.
        }
    }

    render() {
        return (
            <>
                <Upload
                    name="banner"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action={`${ApiManager.getApiUrl()}/upload`}
                    headers={{
                        'X-Access-Token': authToken,
                    }}
                    // beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                    data={{ role: 'banner' }}
                />
                <Upload className="avatar-uploader"></Upload>
                <button>hi</button>
            </>
        )
    }
}

export default connect<any, any, any>(undefined, {
    emitRootKeyChanged: emitRootKeyChanged,
})(UploadAvatar)
