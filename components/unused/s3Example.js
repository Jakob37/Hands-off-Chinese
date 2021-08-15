import React, { useState } from "react";
// import { useState } from "App.js";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

import {
    S3Client,
    CreateBucketCommand,
    DeleteBucketCommand,
    ListBucketsCommand,
    ListObjectsCommand,
    ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { IDENTITY_POOL_ID } from "../../aws.config";

// const s3 = new AWS

const AwsTest = () => {
    const [bucketName, setBucketName] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Replace REGION with the appropriate AWS Region, such as 'us-east-1'.
    const region = "eu-north-1";
    const client = new S3Client({
        region,
        credentials: fromCognitoIdentityPool({
            client: new CognitoIdentityClient({ region }),
            // Replace IDENTITY_POOL_ID with an appropriate Amazon Cognito Identity Pool ID for, such as 'us-east-1:xxxxxx-xxx-4103-9936-b52exxxxfd6'.
            identityPoolId: IDENTITY_POOL_ID,
        }),
    });

    const createBucket = async () => {
        setSuccessMsg("");
        setErrorMsg("");

        // const params = {
        //     Bucket: 'examplebucket',
        //     CreateBucketConfiguration: {
        //         LocationConstraint: 'eu-north-1'
        //     }
        //     S3.createBucket(params, function(err, data)) {
        //         if (err) {
        //             console.log(err, err.stack);
        //         } else {
        //             console.log(data);
        //         }
        //     }
        // }

        try {
            console.log(`Attempting to create bucket name: ${bucketName}`);
            console.log(new CreateBucketCommand({ Bucket: bucketName }));
            await client.send(new CreateBucketCommand({ Bucket: bucketName }));
            setSuccessMsg(`Bucket "${bucketName}" created.`);
        } catch (e) {
            setErrorMsg(`Error message ${e}`);
        }
    };

    const deleteBucket = async () => {
        setSuccessMsg("");
        setErrorMsg("");

        try {
            await client.send(new DeleteBucketCommand({ Bucket: bucketName }));
            setSuccessMsg(`Bucket "${bucketName}" deleted.`);
        } catch (e) {
            setErrorMsg(e);
        }
    };

    const listS3Content = async () => {

        setSuccessMsg("");
        setErrorMsg("test");

        console.log('Listing');

        try {
            await client.send(new ListObjectsV2Command({ Bucket: 'name' }));
            setSuccessMsg(`Success!`);
        } catch (e) {
            setErrorMsg(e);
        }

        // let AWS = require('aws-sdk');
        // client.config.update({region: 'eu-north-1'})
    }

    return (
        <View style={styles.container}>
            <Text style={{ color: "green" }}>
                {successMsg ? `Success: ${successMsg}` : ``}
            </Text>
            <Text style={{ color: "red" }}>
                {errorMsg ? `Error: ${errorMsg}` : ``}
            </Text>
            <View>
                <TextInput
                    // style={styles.textInput}
                    onChangeText={(text) => setBucketName(text)}
                    autoCapitalize={"none"}
                    value={bucketName}
                    placeholder={"Enter Bucket Name"}
                />
                <Button
                    // backroundColor="#68a0cf"
                    title="Create Bucket"
                    onPress={createBucket}
                />
                <Button
                    // backroundColor="#68a0cf"
                    title="Delete Bucket"
                    onPress={deleteBucket}
                />
                <Button 
                    title="List S3 content"
                    onPress={listS3Content}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default AwsTest;