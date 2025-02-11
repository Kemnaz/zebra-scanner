import React, { useContext, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Switch,
  TextInput,
  ScrollView,
  Button,
} from 'react-native';
import { SettingsContext } from '../library/context/SettingsContext';

export default function SettingsScreen() {
  const {
    isIntentEnabled,
    isKeystrokeEnterEnabled,
    intentPrefix,
    keystrokePrefix,
    urlPath,
    updateSettings,
  } = useContext(SettingsContext);

  const [intentPrefixValue, setIntentPrefixValue] = useState(intentPrefix);
  const [keystrokePrefixValue, setKeystrokePrefixValue] =
    useState(keystrokePrefix);
  const [newUrlPath, setNewUrlPath] = useState(urlPath); // State for new URL input

  const handleUrlSubmit = () => {
    // Update the urlPath in the settings context
    updateSettings('urlPath', newUrlPath);
  };

  return (
    <ScrollView>
      <View style={styles.configContainerSection}>
        <Text style={styles.configSectionLabel}>Intent output</Text>
      </View>
      <View style={styles.configContainer}>
        <Text style={styles.configLabel}>Enable intent output</Text>
        <Switch
          value={isIntentEnabled}
          onValueChange={value => updateSettings('isIntentEnabled', value)}
        />
      </View>
      <View style={[styles.configContainer, { paddingVertical: 10 }]}>
        <Text style={styles.configLabel}>Data prefix</Text>
        <TextInput
          value={intentPrefixValue}
          onChangeText={setIntentPrefixValue}
          style={[
            styles.textinput,
            {
              borderColor:
                intentPrefixValue === intentPrefix ? '#D4D4D4' : '#FF4233',
            },
          ]}
          placeholder="Prefix"
          onSubmitEditing={e =>
            updateSettings('intentPrefix', e.nativeEvent.text)
          }
        />
      </View>
      <View style={styles.configContainerSection}>
        <Text style={styles.configSectionLabel}>Keystroke output</Text>
      </View>
      <View style={styles.configContainer}>
        <Text style={styles.configLabel}>Enable keystroke output</Text>
        <Switch
          value={!isIntentEnabled}
          onValueChange={value => updateSettings('isIntentEnabled', !value)}
        />
      </View>
      <View style={styles.configContainer}>
        <Text style={styles.configLabel}>Send ENTER key</Text>
        <Switch
          value={isKeystrokeEnterEnabled}
          onValueChange={value =>
            updateSettings('isKeystrokeEnterEnabled', value)
          }
        />
      </View>
      <View style={[styles.configContainer, { paddingVertical: 10 }]}>
        <Text style={styles.configLabel}>Keystroke Prefix</Text>
        <TextInput
          value={keystrokePrefixValue}
          onChangeText={setKeystrokePrefixValue}
          style={[
            styles.textinput,
            {
              borderColor:
                keystrokePrefixValue === keystrokePrefix
                  ? '#D4D4D4'
                  : '#FF4233',
            },
          ]}
          placeholder="Prefix"
          onSubmitEditing={e =>
            updateSettings('keystrokePrefix', e.nativeEvent.text)
          }
        />
      </View>

      {/* Display and Update URL Path */}
      <View style={[styles.configContainer, { paddingVertical: 20 }]}>
        <Text style={styles.configLabel}>Current URL Path: {urlPath}</Text>
      </View>
      <View style={[styles.configContainer, { paddingVertical: 10 }]}>
        <Text style={styles.configLabel}>New URL Path</Text>
        <TextInput
          value={newUrlPath}
          onChangeText={setNewUrlPath}
          style={styles.textinput}
          placeholder="Enter new URL"
        />
      </View>

      <View style={styles.configContainer}>
        <Button title="Submit URL" onPress={handleUrlSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  configContainer: {
    backgroundColor: '#FEFEFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#D4D4D4',
  },
  configLabel: {
    fontSize: 14,
  },
  configContainerSection: {
    backgroundColor: '#FEFEFE',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginTop: 20,
  },
  configSectionLabel: {
    fontSize: 12,
    color: '#33CCFF',
  },
  textinput: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: 200,
  },
});
